import { useState, type FormEvent } from 'react';
import { ArrowRight, Sprout, Trophy } from 'lucide-react';
import { useListCrops, useListStates, useRecommendCrops, type Recommendation, type RecommendationInput } from '@workspace/api-client-react';
import { AquaShell, Button, Card, CategoryBadge, EmptyBlock, ErrorBlock, PageIntro, SectionLabel, fmt } from '@/components/aqua-shell';
import { PredictionFields, emptyPrediction, type PredictionFormValues } from '@/components/prediction-fields';

export default function Recommend() {
  const [form, setForm] = useState<PredictionFormValues>(emptyPrediction);
  const [results, setResults] = useState<Recommendation[]>([]);
  const crops = useListCrops();
  const states = useListStates();
  const recommend = useRecommendCrops();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    recommend.mutate({ data: { ...form, state: form.state || null } as RecommendationInput }, { onSuccess: setResults });
  };
  return <AquaShell><PageIntro eyebrow="Decision support / 05" title="Find the lighter path." description="Hold the weather, field, and management assumptions steady while the model ranks crop options by predicted footprint." />
    <div className="grid items-start gap-6 xl:grid-cols-[.78fr_1.22fr]"><Card className="p-6"><SectionLabel>Field context</SectionLabel><form onSubmit={submit}><PredictionFields value={form} onChange={setForm} crops={crops.data?.map((item) => item.name) ?? []} states={states.data ?? []} /><Button type="submit" disabled={recommend.isPending || !form.crop} className="mt-7 w-full" data-testid="button-run-recommendation">{recommend.isPending ? 'Ranking crops…' : 'Rank crop options'} <ArrowRight size={15} /></Button>{recommend.isError && <ErrorBlock message="The crop ranking could not be calculated." onRetry={() => recommend.reset()} />}</form></Card>
      <Card className="min-h-[500px] p-6"><div className="mb-6 flex items-center justify-between"><div><SectionLabel>Model ranking</SectionLabel><h2 className="font-display text-3xl">Water efficiency, in order.</h2></div><Sprout size={22} className="text-primary" /></div>{results.length === 0 ? <EmptyBlock title="Set the field context first" body="Your ranked list will appear here after the recommendation model evaluates the scenario." /> : <div className="space-y-3">{results.map((item, index) => <RecommendationRow key={`${item.crop}-${index}`} item={item} index={index} />)}</div>}</Card></div>
  </AquaShell>;
}

function RecommendationRow({ item, index }: { item: Recommendation; index: number }) {
  return <div data-testid={`row-recommendation-${index}`} className={`grid grid-cols-[34px_1fr_auto] gap-3 rounded-xl border p-4 transition-all hover:shadow-sm ${index === 0 ? 'border-accent/50 bg-accent/10' : 'border-border bg-background'}`}><div className="grid h-8 w-8 place-items-center rounded-lg bg-muted font-data text-xs font-bold text-muted-foreground">{index === 0 ? <Trophy size={15} className="text-accent-foreground" /> : item.rank || index + 1}</div><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-extrabold">{item.crop}</p><CategoryBadge category={item.category} /></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.rationale}</p></div><div className="text-right"><p className="font-display text-2xl text-primary">{fmt(item.prediction)}</p><p className="font-data text-[9px] uppercase tracking-wider text-muted-foreground">L/kg</p></div></div>;
}