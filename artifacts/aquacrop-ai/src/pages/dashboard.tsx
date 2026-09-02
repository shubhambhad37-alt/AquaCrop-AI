import { Link } from 'wouter';
import { ArrowUpRight, Database, Info, Sparkles } from 'lucide-react';
import { useGetDashboard } from '@workspace/api-client-react';
import { AquaShell, Card, EmptyBlock, ErrorBlock, LoadingBlock, MetricValue, PageIntro, SectionLabel, fmt } from '@/components/aqua-shell';

export default function Dashboard() {
  const dashboard = useGetDashboard();
  const data = dashboard.data;
  const max = Math.max(...(data?.cropFootprints?.map((item) => item.averageFootprint) ?? [1]));
  return <AquaShell>
    <PageIntro eyebrow="Field intelligence / 01" title="Read the water story." description="A clear starting point for exploring crop water footprints, model behavior, and decisions worth testing." action={<Link href="/predict" data-testid="link-start-prediction" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">New prediction <ArrowUpRight size={15} /></Link>} />
    {dashboard.isLoading ? <LoadingBlock rows={4} /> : dashboard.isError ? <ErrorBlock onRetry={() => dashboard.refetch()} /> : !data ? <EmptyBlock title="No field summary yet" body="Once the dataset is connected, the workspace overview will appear here." /> : <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="animate-rise p-5"><MetricValue value={fmt(data.kpis.averageFootprint)} unit="L/kg" label="Average footprint" accent /></Card>
        <Card className="animate-rise animate-rise-delay-1 p-5"><MetricValue value={fmt(data.kpis.lowestFootprint)} unit="L/kg" label="Lowest observed" /></Card>
        <Card className="animate-rise animate-rise-delay-2 p-5"><MetricValue value={fmt(data.kpis.highestFootprint)} unit="L/kg" label="Highest observed" /></Card>
        <Card className="animate-rise animate-rise-delay-1 p-5"><MetricValue value={data.kpis.cropsAnalyzed} unit="crops" label="Crops analyzed" /></Card>
        <Card className="animate-rise animate-rise-delay-2 p-5"><MetricValue value={data.kpis.bestModel} label="Best ML model" accent /></Card>
        <Card className="animate-rise animate-rise-delay-3 p-5"><MetricValue value={fmt(data.kpis.modelR2, 2)} label="Best model R²" accent /></Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <SectionLabel aside={<span className="font-data text-[10px] text-muted-foreground">L / kg</span>}>Observed crop footprints</SectionLabel>
          <div className="space-y-4">
            {data.cropFootprints.length === 0 ? <EmptyBlock title="No crop observations" body="Footprint observations will populate when the dataset returns rows." /> : data.cropFootprints.slice(0, 7).map((item, index) => <div key={item.crop} data-testid={`row-crop-footprint-${index}`} className="group grid grid-cols-[minmax(80px,.7fr)_1fr_auto] items-center gap-4 text-xs">
              <span className="font-semibold">{item.crop}</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-700 group-hover:bg-accent" style={{ width: `${Math.max(6, (item.averageFootprint / max) * 100)}%` }} /></div>
              <span className="font-data text-[11px] text-muted-foreground">{fmt(item.averageFootprint)}</span>
            </div>)}
          </div>
          <Link href="/compare" data-testid="link-open-comparison" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">Open comparison <ArrowUpRight size={13} /></Link>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-primary px-6 py-6 text-primary-foreground"><div className="mb-5 flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground/10"><Database size={18} /></span><span className="rounded-full bg-accent px-2 py-1 font-data text-[9px] font-medium uppercase tracking-wider text-accent-foreground">{data.dataset.isSynthetic ? 'Demo data' : 'Measured data'}</span></div><p className="font-data text-[10px] uppercase tracking-[0.17em] text-primary-foreground/60">Dataset register</p><h2 className="mt-2 text-lg font-extrabold tracking-tight">{data.dataset.name}</h2><p className="mt-1 text-xs text-primary-foreground/65">{data.dataset.source}</p></div>
          <div className="space-y-4 p-6"><div className="flex justify-between text-xs"><span className="text-muted-foreground">Rows available</span><span className="font-data">{data.dataset.rows.toLocaleString()}</span></div><div className="flex justify-between text-xs"><span className="text-muted-foreground">Target signal</span><span className="font-data">{data.dataset.target}</span></div><div className="flex justify-between text-xs"><span className="text-muted-foreground">Model</span><span className="font-data">{data.model.model}</span></div><div className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground"><Info size={14} className="mr-1 inline-block text-primary" />{data.dataset.methodologyNote}</div><Link href="/about" data-testid="link-read-methodology" className="block text-xs font-bold text-primary hover:underline">Read the methodology</Link></div>
        </Card>
      </div>
      <Card className="flex flex-col gap-4 border-accent/30 bg-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Sparkles size={18} className="mt-0.5 text-primary" /><div><p className="text-sm font-bold">Make the next question concrete.</p><p className="mt-1 text-xs text-muted-foreground">Test a scenario, then keep the assumptions visible beside the estimate.</p></div></div><Link href="/simulator" data-testid="link-open-scenario-lab" className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm">Open scenario lab</Link></Card>
    </div>}
  </AquaShell>;
}