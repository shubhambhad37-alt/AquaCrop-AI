import { useState, type FormEvent } from 'react';
import { ArrowRight, FlaskConical, Minus, Plus, RefreshCw, Waves } from 'lucide-react';
import { useListCrops, useListStates, useSimulateScenario, type SimulationResult } from '@workspace/api-client-react';
import { AquaShell, Button, Card, CategoryBadge, ErrorBlock, PageIntro, SectionLabel, fmt } from '@/components/aqua-shell';
import { PredictionFields, emptyPrediction, type PredictionFormValues } from '@/components/prediction-fields';

export default function Simulator() {
  const [current, setCurrent] = useState<PredictionFormValues>(emptyPrediction);
  const [modified, setModified] = useState<PredictionFormValues>({ ...emptyPrediction, irrigationType: 'Drip', irrigationWater: 3800 });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const crops = useListCrops();
  const states = useListStates();
  const simulation = useSimulateScenario();
  const run = (event: FormEvent) => {
    event.preventDefault();
    simulation.mutate({ data: { current: { ...current, state: current.state || null }, modified: { ...modified, state: modified.state || null } } }, { onSuccess: setResult });
  };
  const names = crops.data?.map((item) => item.name) ?? [];
  return <AquaShell><PageIntro eyebrow="Scenario lab / 04" title="Change one thing. See the delta." description="Keep a current practice beside a modified one to explore model-based savings. The difference is directional, not a guarantee." action={<div className="flex items-center gap-2 font-data text-[10px] uppercase tracking-widest text-muted-foreground"><Waves size={15} className="text-primary" />two paths / one model</div>} />
    <form onSubmit={run} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-t-4 border-t-muted p-6"><div className="mb-6 flex items-center justify-between"><div><SectionLabel>Current practice</SectionLabel><h2 className="font-display text-2xl">The baseline</h2></div><span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"><Minus size={18} /></span></div><PredictionFields value={current} onChange={setCurrent} crops={names} states={states.data ?? []} /></Card>
        <Card className="border-t-4 border-t-accent p-6"><div className="mb-6 flex items-center justify-between"><div><SectionLabel>Modified practice</SectionLabel><h2 className="font-display text-2xl">The experiment</h2></div><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/25 text-accent-foreground"><Plus size={18} /></span></div><PredictionFields value={modified} onChange={setModified} crops={names} states={states.data ?? []} /></Card>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><Button type="submit" disabled={simulation.isPending || !current.crop || !modified.crop} data-testid="button-run-simulation">{simulation.isPending ? 'Comparing paths…' : 'Run scenario comparison'} <ArrowRight size={15} /></Button><span className="text-[11px] text-muted-foreground">Both scenarios are passed through the same model.</span></div>
      {simulation.isError && <ErrorBlock message="The model could not compare these scenarios." onRetry={() => simulation.reset()} />}
    </form>
    {result && <SimulationResultPanel result={result} />}
  </AquaShell>;
}

function SimulationResultPanel({ result }: { result: SimulationResult }) {
  const saving = result.estimatedSaving ?? Math.abs(result.difference);
  return <Card className="mt-8 animate-rise overflow-hidden"><div className="grid divide-y border-b border-border bg-primary text-primary-foreground md:grid-cols-3 md:divide-x md:divide-y-0"><div className="p-6"><p className="font-data text-[10px] uppercase tracking-widest text-primary-foreground/60">Current</p><p className="mt-2 font-display text-4xl">{fmt(result.current.prediction)}<small className="ml-1 text-sm text-primary-foreground/60">L/kg</small></p><CategoryBadge category={result.current.category} /></div><div className="p-6"><p className="font-data text-[10px] uppercase tracking-widest text-primary-foreground/60">Modified</p><p className="mt-2 font-display text-4xl">{fmt(result.modified.prediction)}<small className="ml-1 text-sm text-primary-foreground/60">L/kg</small></p><CategoryBadge category={result.modified.category} /></div><div className="bg-accent p-6 text-accent-foreground"><p className="font-data text-[10px] uppercase tracking-widest text-accent-foreground/65">Estimated shift</p><p className="mt-2 font-display text-4xl">{fmt(Math.abs(result.percentChange))}<small className="ml-1 text-sm text-accent-foreground/65">%</small></p><p className="mt-2 text-xs font-bold">{saving >= 0 ? `${fmt(saving)} L/kg estimated saving` : 'Higher modeled footprint'}</p></div></div><div className="grid gap-6 p-6 md:grid-cols-[1fr_.8fr]"><div><SectionLabel>Reading the result</SectionLabel><p className="text-sm leading-6 text-muted-foreground">{result.note}</p></div><div className="rounded-lg border border-border bg-muted/35 p-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold"><RefreshCw size={14} className="text-primary" />Model-based comparison</div><p className="text-[11px] leading-5 text-muted-foreground">This delta reflects only the changed inputs. It does not measure water delivered or verify an on-farm intervention.</p></div></div></Card>;
}