import { useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Save, Target } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetHistoryQueryKey, useListCrops, useListStates, usePredictWaterFootprint, useSaveHistory, type PredictionResult } from '@workspace/api-client-react';
import { AquaShell, Button, Card, CategoryBadge, ErrorBlock, PageIntro, SectionLabel, fmt } from '@/components/aqua-shell';
import { PredictionFields, emptyPrediction, type PredictionFormValues } from '@/components/prediction-fields';

export default function Predict() {
  const [form, setForm] = useState<PredictionFormValues>(emptyPrediction);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const crops = useListCrops();
  const states = useListStates();
  const predict = usePredictWaterFootprint();
  const save = useSaveHistory();
  const queryClient = useQueryClient();
  const cropNames = crops.data?.map((item) => item.name) ?? [];
  const submit = (event: FormEvent) => {
    event.preventDefault();
    predict.mutate({ data: { ...form, state: form.state || null } }, { onSuccess: setResult });
  };
  const saveResult = () => {
    if (!result) return;
    save.mutate({ data: { crop: result.inputs.crop, prediction: result.prediction, category: result.category, scenarioType: 'prediction', inputs: { ...result.inputs } } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() }) });
  };
  return <AquaShell>
    <PageIntro eyebrow="Estimate / 02" title="One scenario, explained." description="Put a crop and its growing conditions under the model. The estimate stays paired with the inputs that shaped it." />
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.8fr)]">
      <Card className="p-6 sm:p-8"><SectionLabel>Scenario inputs</SectionLabel><form onSubmit={submit}><PredictionFields value={form} onChange={setForm} crops={cropNames} states={states.data ?? []} /><Button type="submit" disabled={predict.isPending || !form.crop} className="mt-7 w-full sm:w-auto" data-testid="button-run-prediction">{predict.isPending ? 'Reading the field…' : 'Estimate footprint'} <ArrowRight size={15} /></Button>{predict.isError && <ErrorBlock message="Check the input values and try the estimate again." onRetry={() => predict.reset()} />}</form></Card>
      <div className="space-y-6">
        {!result && <Card className="border-dashed bg-muted/30 p-8"><div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Target size={20} /></div><h2 className="mt-5 font-display text-3xl leading-none">The result will have a paper trail.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Run a prediction to see the footprint, confidence context, and the factors the model used to explain its direction.</p><div className="mt-6 flex items-center gap-2 font-data text-[10px] uppercase tracking-wider text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-accent" />not a measurement</div></Card>}
        {result && <ResultPanel result={result} onSave={saveResult} saving={save.isPending} saved={save.isSuccess} />}
      </div>
    </div>
  </AquaShell>;
}

function ResultPanel({ result, onSave, saving, saved }: { result: PredictionResult; onSave: () => void; saving: boolean; saved: boolean }) {
  return <Card className="overflow-hidden animate-rise"><div className="border-b border-border bg-primary px-6 py-7 text-primary-foreground"><div className="flex items-start justify-between gap-4"><div><p className="font-data text-[10px] uppercase tracking-[0.17em] text-primary-foreground/60">Predicted water footprint</p><p className="mt-2 font-display text-6xl tracking-[-0.05em]">{fmt(result.prediction)}<span className="ml-2 text-base tracking-normal text-primary-foreground/60">L/kg</span></p></div><CategoryBadge category={result.category} /></div><p className="mt-5 text-xs text-primary-foreground/70">Model: <span className="font-semibold text-primary-foreground">{result.model}</span></p></div><div className="space-y-6 p-6"><div className="flex gap-3 rounded-lg border border-accent/30 bg-accent/10 p-3"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-accent-foreground" /><p className="text-xs leading-5 text-muted-foreground">{result.methodologyNote}</p></div><div><SectionLabel aside={<span className="text-[10px] normal-case tracking-normal text-muted-foreground">relative influence</span>}>What moved the estimate</SectionLabel><div className="space-y-4">{result.explanation.map((item, index) => <div key={item.feature} data-testid={`row-explanation-${index}`}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-semibold">{item.label || item.feature}</span><span className="font-data text-muted-foreground">{fmt(item.importance * 100, 0)}%</span></div><div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(8, item.importance * 100))}%` }} /></div><p className="mt-1 text-[11px] leading-4 text-muted-foreground">{item.explanation}</p></div>)}</div></div><div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-muted-foreground">{result.componentsSupported ? <><CheckCircle2 size={15} className="text-primary" />Components supported</> : <><AlertTriangle size={15} className="text-accent-foreground" />Components unavailable</>}</div><Button variant="secondary" onClick={onSave} disabled={saving || saved} data-testid="button-save-prediction"><Save size={14} />{saved ? 'Saved to history' : saving ? 'Saving…' : 'Save to history'}</Button></div></div></Card>;
}