export type FarmInput = {
  crop: string;
  state?: string | null;
  temperature: number;
  rainfall: number;
  cultivatedArea: number;
  productionQuantity: number;
  irrigationWater: number;
  irrigationType: string;
  soilType: string;
  growingDuration: number;
};

type Row = FarmInput & { target: number };
type TreeNode =
  | { leaf: true; value: number }
  | {
      leaf: false;
      feature: number;
      threshold: number;
      left: TreeNode;
      right: TreeNode;
      gain: number;
    };

export const CROPS = [
  "Rice",
  "Wheat",
  "Maize",
  "Sugarcane",
  "Cotton",
  "Soybean",
  "Groundnut",
  "Tomato",
  "Potato",
  "Onion",
] as const;

export const STATES = [
  "Maharashtra",
  "Punjab",
  "Haryana",
  "Gujarat",
  "Karnataka",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
  "West Bengal",
  "Tamil Nadu",
] as const;

const IRRIGATION_TYPES = ["Flood", "Sprinkler", "Drip", "Rainfed"] as const;
const SOIL_TYPES = ["Alluvial", "Black", "Red", "Loamy", "Sandy"] as const;
export const FEATURE_NAMES = [
  "temperature",
  "rainfall",
  "cultivatedArea",
  "productionQuantity",
  "irrigationWater",
  "growingDuration",
  "crop",
  "irrigationType",
  "soilType",
];
export const FEATURE_LABELS: Record<string, string> = {
  temperature: "Temperature",
  rainfall: "Rainfall",
  cultivatedArea: "Cultivated area",
  productionQuantity: "Production quantity",
  irrigationWater: "Irrigation water",
  growingDuration: "Growing duration",
  crop: "Crop",
  irrigationType: "Irrigation type",
  soilType: "Soil type",
};

const cropBase: Record<string, number> = {
  Rice: 1450,
  Wheat: 880,
  Maize: 640,
  Sugarcane: 1880,
  Cotton: 1050,
  Soybean: 690,
  Groundnut: 510,
  Tomato: 330,
  Potato: 290,
  Onion: 230,
};
const cropIndex = (value: string) => Math.max(0, CROPS.indexOf(value as (typeof CROPS)[number]));
const stateIndex = (value: string | null | undefined) =>
  Math.max(0, STATES.indexOf(value as (typeof STATES)[number]));
const irrigationIndex = (value: string) =>
  Math.max(0, IRRIGATION_TYPES.indexOf(value as (typeof IRRIGATION_TYPES)[number]));
const soilIndex = (value: string) =>
  Math.max(0, SOIL_TYPES.indexOf(value as (typeof SOIL_TYPES)[number]));

function targetFor(input: FarmInput, noise = 0): number {
  const base = cropBase[input.crop] ?? 720;
  const irrigationMultiplier = [1, 0.84, 0.68, 0.48][irrigationIndex(input.irrigationType)] ?? 1;
  const soilAdjustment = [0, -25, 18, -12, 35][soilIndex(input.soilType)] ?? 0;
  const yieldPerHa = input.productionQuantity / Math.max(input.cultivatedArea, 0.1);
  const raw =
    base +
    input.irrigationWater * 0.24 * irrigationMultiplier -
    input.rainfall * 0.12 +
    input.growingDuration * 2.8 +
    Math.abs(input.temperature - 25) * 7 +
    soilAdjustment -
    Math.min(yieldPerHa, 140) * 3.8 +
    stateIndex(input.state) * 2.5 +
    noise;
  return Math.max(80, Math.round(raw * 10) / 10);
}

function makeDataset(): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < 240; i += 1) {
    const crop = CROPS[i % CROPS.length];
    const state = STATES[(i * 3 + Math.floor(i / 10)) % STATES.length];
    const irrigationType = IRRIGATION_TYPES[(i * 5 + 1) % IRRIGATION_TYPES.length];
    const soilType = SOIL_TYPES[(i * 7 + 2) % SOIL_TYPES.length];
    const temperature = 17 + ((i * 13) % 190) / 10;
    const rainfall = 180 + ((i * 71) % 1250);
    const cultivatedArea = 0.8 + ((i * 17) % 520) / 100;
    const productionQuantity = Math.max(2, cultivatedArea * (18 + ((i * 19) % 115)));
    const irrigationWater =
      irrigationType === "Rainfed" ? 60 + ((i * 23) % 250) : 300 + ((i * 37) % 3400);
    const growingDuration = 65 + ((i * 29) % 180);
    const noise = (((i * 47) % 31) - 15) * 2.3;
    const input: FarmInput = {
      crop,
      state,
      temperature,
      rainfall,
      cultivatedArea,
      productionQuantity,
      irrigationWater,
      irrigationType,
      soilType,
      growingDuration,
    };
    rows.push({ ...input, target: targetFor(input, noise) });
  }
  return rows;
}

function vector(input: FarmInput): number[] {
  return [
    input.temperature,
    input.rainfall / 100,
    input.cultivatedArea,
    input.productionQuantity / 10,
    input.irrigationWater / 100,
    input.growingDuration / 10,
    cropIndex(input.crop),
    irrigationIndex(input.irrigationType),
    soilIndex(input.soilType),
  ];
}

function mean(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function sumSquared(values: number[], center = mean(values)): number {
  return values.reduce((sum, value) => sum + (value - center) ** 2, 0);
}

function invert(matrix: number[][]): number[][] {
  const size = matrix.length;
  const augmented = matrix.map((row, rowIndex) => [
    ...row,
    ...Array.from({ length: size }, (_, columnIndex) => (rowIndex === columnIndex ? 1 : 0)),
  ]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1) {
      if (Math.abs(augmented[row][column]) > Math.abs(augmented[pivot][column])) pivot = row;
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const divisor = augmented[column][column] || 1e-9;
    for (let j = 0; j < size * 2; j += 1) augmented[column][j] /= divisor;
    for (let row = 0; row < size; row += 1) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let j = 0; j < size * 2; j += 1) augmented[row][j] -= factor * augmented[column][j];
    }
  }
  return augmented.map((row) => row.slice(size));
}

function fitLinear(rows: Row[]) {
  const dimension = FEATURE_NAMES.length + 1;
  const xtx = Array.from({ length: dimension }, () => Array(dimension).fill(0));
  const xty = Array(dimension).fill(0);
  for (const row of rows) {
    const x = [1, ...vector(row)];
    for (let i = 0; i < dimension; i += 1) {
      xty[i] += x[i] * row.target;
      for (let j = 0; j < dimension; j += 1) xtx[i][j] += x[i] * x[j];
    }
  }
  for (let i = 1; i < dimension; i += 1) xtx[i][i] += 0.15;
  const coefficients = invert(xtx).map((row) => row.reduce((sum, value, j) => sum + value * xty[j], 0));
  return {
    predict: (input: FarmInput) => [1, ...vector(input)].reduce((sum, value, i) => sum + value * coefficients[i], 0),
    importances: coefficients.slice(1).map((coefficient) => Math.abs(coefficient)),
  };
}

function fitTree(rows: Row[], depth: number, maxDepth: number): TreeNode {
  const targets = rows.map((row) => row.target);
  if (rows.length < 8 || depth >= maxDepth || sumSquared(targets) < 1200) {
    return { leaf: true, value: mean(targets) };
  }
  let best: { feature: number; threshold: number; gain: number; left: Row[]; right: Row[] } | undefined;
  const parentError = sumSquared(targets);
  for (let feature = 0; feature < FEATURE_NAMES.length; feature += 1) {
    const values = rows.map((row) => vector(row)[feature]).sort((a, b) => a - b);
    const candidates = [0.2, 0.4, 0.6, 0.8].map((fraction) => values[Math.floor((values.length - 1) * fraction)]);
    for (const threshold of candidates) {
      const left = rows.filter((row) => vector(row)[feature] <= threshold);
      const right = rows.filter((row) => vector(row)[feature] > threshold);
      if (!left.length || !right.length) continue;
      const gain = parentError - sumSquared(left.map((row) => row.target)) - sumSquared(right.map((row) => row.target));
      if (!best || gain > best.gain) best = { feature, threshold, gain, left, right };
    }
  }
  if (!best || best.gain < 60) return { leaf: true, value: mean(targets) };
  return {
    leaf: false,
    feature: best.feature,
    threshold: best.threshold,
    gain: best.gain,
    left: fitTree(best.left, depth + 1, maxDepth),
    right: fitTree(best.right, depth + 1, maxDepth),
  };
}

function predictTree(node: TreeNode, input: FarmInput): number {
  if (node.leaf) return node.value;
  return vector(input)[node.feature] <= node.threshold
    ? predictTree(node.left, input)
    : predictTree(node.right, input);
}

function collectTreeImportance(node: TreeNode, output: number[]) {
  if (node.leaf) return;
  output[node.feature] += node.gain;
  collectTreeImportance(node.left, output);
  collectTreeImportance(node.right, output);
}

function makeForest(rows: Row[]) {
  let seed = 8127;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const trees = Array.from({ length: 18 }, () => {
    const sample = Array.from({ length: rows.length }, () => rows[Math.floor(random() * rows.length)]);
    return fitTree(sample, 0, 6);
  });
  const importances = Array(FEATURE_NAMES.length).fill(0);
  trees.forEach((tree) => collectTreeImportance(tree, importances));
  return {
    predict: (input: FarmInput) => mean(trees.map((tree) => predictTree(tree, input))),
    importances,
  };
}

function score(model: { predict: (input: FarmInput) => number }, rows: Row[]) {
  const errors = rows.map((row) => row.target - model.predict(row));
  const actual = rows.map((row) => row.target);
  const mae = mean(errors.map((error) => Math.abs(error)));
  const rmse = Math.sqrt(mean(errors.map((error) => error ** 2)));
  const r2 = 1 - sumSquared(errors, 0) / Math.max(sumSquared(actual), 1);
  return { mae, rmse, r2 };
}

const DATASET = makeDataset();
const trainingRows = DATASET.filter((_, index) => index % 5 !== 0);
const testRows = DATASET.filter((_, index) => index % 5 === 0);
const linearStartedAt = Date.now();
const linearModel = fitLinear(trainingRows);
const linearTrainingTimeMs = Date.now() - linearStartedAt;
const treeStartedAt = Date.now();
const treeModel = {
  tree: fitTree(trainingRows, 0, 7),
  predict(input: FarmInput) {
    return predictTree(this.tree, input);
  },
  importances: Array(FEATURE_NAMES.length).fill(0) as number[],
};
collectTreeImportance(treeModel.tree, treeModel.importances);
const treeTrainingTimeMs = Date.now() - treeStartedAt;
const forestStartedAt = Date.now();
const forestModel = makeForest(trainingRows);
const forestTrainingTimeMs = Date.now() - forestStartedAt;
const evaluated = [
  { model: "Linear Regression", implementation: linearModel, trainingTimeMs: linearTrainingTimeMs },
  { model: "Decision Tree", implementation: treeModel, trainingTimeMs: treeTrainingTimeMs },
  { model: "Random Forest", implementation: forestModel, trainingTimeMs: forestTrainingTimeMs },
].map((entry) => ({ ...entry, ...score(entry.implementation, testRows) }));
const best = [...evaluated].sort((a, b) => a.rmse - b.rmse)[0];

function normalized(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  return values.map((value) => value / total);
}

const bestImportance = best.model === "Random Forest"
  ? forestModel.importances
  : best.model === "Decision Tree"
    ? treeModel.importances
    : linearModel.importances;
const importanceValues = normalized(bestImportance);

export const modelSummary = {
  models: evaluated.map(({ model, mae, rmse, r2, trainingTimeMs }) => ({
    model,
    mae: round(mae),
    rmse: round(rmse),
    r2: round(r2),
    trainingTimeMs,
  })),
  bestModel: best.model,
  validationMethod: "80/20 deterministic holdout split (every fifth row reserved for testing)",
  actualVsPredicted: testRows.map((row) => ({
    actual: round(row.target),
    predicted: round(best.implementation.predict(row)),
  })),
};

export const datasetInfo = {
  name: "AquaCrop AI Demonstration Dataset",
  source: "Synthetic dataset generated from documented agronomic assumptions",
  isSynthetic: true,
  rows: DATASET.length,
  target: "Water footprint (L/kg)",
  methodologyNote:
    "Synthetic values combine crop water intensity priors with irrigation, weather, duration, soil, yield, and regional factors. They demonstrate the ML workflow and are not authoritative field measurements.",
};

export function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function availableCrops() {
  return CROPS.map((name) => {
    const values = DATASET.filter((row) => row.crop === name).map((row) => row.target);
    return {
      name,
      averageFootprint: round(mean(values)),
      observations: values.length,
    };
  });
}

export function cropFootprints() {
  return CROPS.map((crop) => {
    const values = DATASET.filter((row) => row.crop === crop).map((row) => row.target);
    return {
      crop,
      averageFootprint: round(mean(values)),
      minFootprint: round(Math.min(...values)),
      maxFootprint: round(Math.max(...values)),
      observations: values.length,
    };
  });
}

export function classify(prediction: number): "LOW" | "MEDIUM" | "HIGH" {
  const low = Number(process.env.AQUACROP_LOW_THRESHOLD ?? 550);
  const medium = Number(process.env.AQUACROP_MEDIUM_THRESHOLD ?? 1100);
  if (prediction < low) return "LOW";
  if (prediction < medium) return "MEDIUM";
  return "HIGH";
}

export function explain(input: FarmInput) {
  return FEATURE_NAMES.map((feature, index) => {
    const importance = importanceValues[index] ?? 0;
    return {
      feature,
      importance: round(importance),
      label: FEATURE_LABELS[feature],
      explanation:
        importance > 0.2
          ? `The model considers ${FEATURE_LABELS[feature].toLowerCase()} a strong contributor for this estimate.`
          : `The model uses ${FEATURE_LABELS[feature].toLowerCase()} as a supporting signal for this estimate.`,
    };
  }).sort((a, b) => b.importance - a.importance);
}

export function predict(input: FarmInput) {
  const prediction = Math.max(0, round(best.implementation.predict(input)));
  return {
    prediction,
    category: classify(prediction),
    model: best.model,
    explanation: explain(input),
    componentsSupported: false,
    methodologyNote:
      "Blue/Green/Grey breakdown requires additional field data and is shown only when supported by the selected methodology/dataset.",
    inputs: input,
  };
}

export function dashboard() {
  const values = DATASET.map((row) => row.target);
  return {
    dataset: datasetInfo,
    kpis: {
      cropsAnalyzed: CROPS.length,
      averageFootprint: round(mean(values)),
      lowestFootprint: round(Math.min(...values)),
      highestFootprint: round(Math.max(...values)),
      bestModel: best.model,
      modelR2: round(best.r2),
    },
    cropFootprints: cropFootprints(),
    model: modelSummary.models.find((model) => model.model === best.model),
  };
}

export function recommendation(input: FarmInput) {
  return CROPS.map((crop) => {
    const result = predict({ ...input, crop });
    return {
      crop,
      prediction: result.prediction,
      category: result.category,
      rationale: `Under the supplied conditions, ${crop} has a model-estimated footprint of ${result.prediction} L/kg.`,
    };
  })
    .sort((a, b) => a.prediction - b.prediction)
    .map((result, index) => ({ ...result, rank: index + 1 }));
}

export const supportedIrrigationTypes = [...IRRIGATION_TYPES];
export const supportedSoilTypes = [...SOIL_TYPES];