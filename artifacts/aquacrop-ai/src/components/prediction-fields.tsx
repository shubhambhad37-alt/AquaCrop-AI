import type { PredictionInput } from '@workspace/api-client-react';
import { Field, FormGrid, Input, Select } from '@/components/forms';

export type PredictionFormValues = Omit<PredictionInput, 'state'> & { state: string };

export const emptyPrediction: PredictionFormValues = {
  crop: '',
  state: '',
  temperature: 25,
  rainfall: 600,
  cultivatedArea: 10,
  productionQuantity: 25,
  irrigationWater: 5000,
  irrigationType: 'Drip',
  soilType: 'Loamy',
  growingDuration: 120,
};

export function PredictionFields({ value, onChange, crops, states }: { value: PredictionFormValues; onChange: (next: PredictionFormValues) => void; crops: string[]; states: string[] }) {
  const set = (key: keyof PredictionFormValues, raw: string) => onChange({ ...value, [key]: ['temperature', 'rainfall', 'cultivatedArea', 'productionQuantity', 'irrigationWater', 'growingDuration'].includes(key) ? Number(raw) : raw });
  return <div className="space-y-5">
    <FormGrid>
      <Field label="Crop">
        <Select value={value.crop} onChange={(event) => set('crop', event.target.value)} data-testid="select-prediction-crop">
          <option value="">Choose a crop</option>{crops.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
        </Select>
      </Field>
      <Field label="Region / state" hint="Optional context from the dataset">
        <Select value={value.state} onChange={(event) => set('state', event.target.value)} data-testid="select-prediction-state">
          <option value="">Not specified</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}
        </Select>
      </Field>
    </FormGrid>
    <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
      <Field label="Temperature" hint="°C average during growing period"><Input type="number" value={value.temperature} onChange={(event) => set('temperature', event.target.value)} data-testid="input-temperature" /></Field>
      <Field label="Rainfall" hint="mm during growing period"><Input type="number" value={value.rainfall} onChange={(event) => set('rainfall', event.target.value)} data-testid="input-rainfall" /></Field>
      <Field label="Cultivated area" hint="hectares"><Input type="number" value={value.cultivatedArea} onChange={(event) => set('cultivatedArea', event.target.value)} data-testid="input-cultivated-area" /></Field>
      <Field label="Production quantity" hint="tonnes"><Input type="number" value={value.productionQuantity} onChange={(event) => set('productionQuantity', event.target.value)} data-testid="input-production-quantity" /></Field>
      <Field label="Irrigation water" hint="litres applied"><Input type="number" min="0" value={value.irrigationWater} onChange={(event) => set('irrigationWater', event.target.value)} data-testid="input-irrigation-water" /></Field>
      <Field label="Growing duration" hint="days"><Input type="number" value={value.growingDuration} onChange={(event) => set('growingDuration', event.target.value)} data-testid="input-growing-duration" /></Field>
    </div>
    <FormGrid>
      <Field label="Irrigation method"><Select value={value.irrigationType} onChange={(event) => set('irrigationType', event.target.value)} data-testid="select-irrigation-type"><option>Drip</option><option>Sprinkler</option><option>Flood</option><option>Rainfed</option></Select></Field>
      <Field label="Soil type"><Select value={value.soilType} onChange={(event) => set('soilType', event.target.value)} data-testid="select-soil-type"><option>Alluvial</option><option>Black</option><option>Red</option><option>Loamy</option><option>Sandy</option></Select></Field>
    </FormGrid>
  </div>;
}