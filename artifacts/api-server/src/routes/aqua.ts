import { Router, type IRouter } from "express";
import {
  GetHistoryResponse,
  PredictWaterFootprintBody,
  RecommendCropsBody,
  SaveHistoryBody,
  SimulateScenarioBody,
} from "@workspace/api-zod";
import {
  availableCrops,
  classify,
  cropFootprints,
  dashboard,
  modelSummary,
  predict,
  recommendation,
  round,
  CROPS,
  STATES,
  supportedIrrigationTypes,
  supportedSoilTypes,
  type FarmInput,
} from "../lib/aquacrop";

const router: IRouter = Router();
type HistoryItem = {
  id: number;
  timestamp: string;
  crop: string;
  prediction: number;
  category: string;
  scenarioType: string;
  inputs: Record<string, unknown>;
};
const history: HistoryItem[] = [];
let nextHistoryId = 1;

function invalid(res: Parameters<Parameters<IRouter["post"]>[1]>[1], message: string) {
  res.status(400).json({ error: message });
}

function validateFarmInput(input: FarmInput): string | null {
  if (!CROPS.includes(input.crop as (typeof CROPS)[number])) return "Choose a crop from the dataset.";
  if (input.state && !STATES.includes(input.state as (typeof STATES)[number])) return "Choose a region from the dataset.";
  if (!supportedIrrigationTypes.includes(input.irrigationType as (typeof supportedIrrigationTypes)[number])) return "Choose a supported irrigation method.";
  if (!supportedSoilTypes.includes(input.soilType as (typeof supportedSoilTypes)[number])) return "Choose a supported soil type.";
  const numbers = [
    input.temperature,
    input.rainfall,
    input.cultivatedArea,
    input.productionQuantity,
    input.irrigationWater,
    input.growingDuration,
  ];
  if (numbers.some((value) => !Number.isFinite(value) || value < 0)) return "Numeric inputs must be zero or greater.";
  return null;
}

router.get("/crops", (_req, res) => {
  res.json(availableCrops());
});

router.get("/states", (_req, res) => {
  res.json([...STATES]);
});

router.get("/dashboard", (_req, res) => {
  res.json(dashboard());
});

router.get("/model-performance", (_req, res) => {
  res.json(modelSummary);
});

router.get("/feature-importance", (_req, res) => {
  const result = predict({
    crop: "Rice",
    state: STATES[0],
    temperature: 25,
    rainfall: 750,
    cultivatedArea: 2,
    productionQuantity: 70,
    irrigationWater: 1800,
    irrigationType: "Flood",
    soilType: "Alluvial",
    growingDuration: 130,
  });
  res.json(result.explanation);
});

router.get("/crop-footprints", (_req, res) => {
  res.json(cropFootprints());
});

router.post("/predict", (req, res) => {
  const parsed = PredictWaterFootprintBody.safeParse(req.body);
  if (!parsed.success) {
    invalid(res, "Please provide valid agricultural inputs. Numbers must be positive and all categories must be selected.");
    return;
  }
  try {
    const input = parsed.data as FarmInput;
    const error = validateFarmInput(input);
    if (error) return invalid(res, error);
    res.json(predict(input));
  } catch {
    invalid(res, "We could not calculate an estimate from those inputs.");
  }
});

router.post("/simulate", (req, res) => {
  const parsed = SimulateScenarioBody.safeParse(req.body);
  if (!parsed.success) {
    invalid(res, "Please complete both current and modified scenarios.");
    return;
  }
  try {
    const currentInput = parsed.data.current as FarmInput;
    const modifiedInput = parsed.data.modified as FarmInput;
    const currentError = validateFarmInput(currentInput);
    const modifiedError = validateFarmInput(modifiedInput);
    if (currentError || modifiedError) return invalid(res, currentError ?? modifiedError ?? "Please review the scenario inputs.");
    const current = predict(currentInput);
    const modified = predict(modifiedInput);
    const difference = round(modified.prediction - current.prediction);
    const percentChange = current.prediction ? round((difference / current.prediction) * 100) : 0;
    res.json({
      current,
      modified,
      difference,
      percentChange,
      estimatedSaving: round(Math.max(0, current.prediction - modified.prediction)),
      note: "This is a model-based scenario simulation, not a guaranteed real-world saving.",
    });
  } catch {
    invalid(res, "We could not compare those scenarios.");
  }
});

router.post("/recommend", (req, res) => {
  const parsed = RecommendCropsBody.safeParse(req.body);
  if (!parsed.success) {
    invalid(res, "Please complete the growing conditions before requesting recommendations.");
    return;
  }
  try {
    const input = parsed.data as FarmInput;
    const error = validateFarmInput(input);
    if (error) return invalid(res, error);
    res.json(recommendation(input));
  } catch {
    invalid(res, "We could not rank crops for those conditions.");
  }
});

router.get("/history", (_req, res) => {
  res.json(GetHistoryResponse.parse([...history].reverse()));
});

router.post("/history", (req, res) => {
  const parsed = SaveHistoryBody.safeParse(req.body);
  if (!parsed.success) {
    invalid(res, "The prediction record is incomplete.");
    return;
  }
  const item: HistoryItem = {
    id: nextHistoryId++,
    timestamp: new Date().toISOString(),
    crop: parsed.data.crop,
    prediction: parsed.data.prediction,
    category: parsed.data.category,
    scenarioType: parsed.data.scenarioType,
    inputs: parsed.data.inputs,
  };
  history.push(item);
  res.status(201).json(item);
});

router.delete("/history", (_req, res) => {
  history.length = 0;
  res.status(204).send();
});

export default router;