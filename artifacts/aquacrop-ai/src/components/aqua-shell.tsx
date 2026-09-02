import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Activity, BarChart3, BookOpen, ChevronRight, Clock3, Droplets, FlaskConical, Gauge, Menu, Moon, Network, Sprout, Sun, Target, X } from 'lucide-react';
import { useHealthCheck } from '@workspace/api-client-react';

type NavItem = { href: string; label: string; icon: typeof Gauge };

const navItems: NavItem[] = [
  { href: '/', label: 'Overview', icon: Gauge },
  { href: '/predict', label: 'Predict', icon: Target },
  { href: '/compare', label: 'Compare footprints', icon: BarChart3 },
  { href: '/simulator', label: 'Scenario lab', icon: FlaskConical },
  { href: '/recommend', label: 'Recommend', icon: Sprout },
  { href: '/performance', label: 'Performance', icon: Activity },
];

const secondaryItems: NavItem[] = [
  { href: '/history', label: 'History', icon: Clock3 },
  { href: '/about', label: 'Methodology', icon: BookOpen },
];

export function AquaShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const health = useHealthCheck();

  const toggleTheme = () => {
    setDark((value) => {
      document.documentElement.classList.toggle('dark', !value);
      return !value;
    });
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? 'flex lg:hidden absolute z-40 inset-y-0 left-0 w-[280px] shadow-lg' : 'hidden lg:flex w-[264px] shrink-0'} bg-sidebar text-sidebar-foreground flex-col`}>
      <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-6">
        <Link href="/" data-testid="link-brand" className="flex items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition-transform group-hover:rotate-[-8deg]">
            <Droplets size={21} strokeWidth={2.3} />
          </span>
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-0.03em]">AquaCrop</span>
            <span className="block font-data text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/55">field intelligence</span>
          </span>
        </Link>
        {mobile && <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation" className="rounded-lg p-2 hover:bg-sidebar-accent"><X size={18} /></button>}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-3 px-3 font-data text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/40">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}>
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span className="flex-1">{label}</span>
              {active && <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
            </Link>;
          })}
        </nav>
        <p className="mb-3 mt-9 px-3 font-data text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/40">Reference</p>
        <nav className="space-y-1">
          {secondaryItems.map(({ href, label, icon: Icon }) => {
            const active = location.startsWith(href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>;
          })}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 rounded-xl bg-sidebar-accent/70 px-3 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold"><span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-destructive' : 'bg-sidebar-primary'}`} />{health.isError ? 'Signal unavailable' : 'Model online'}</div>
          <p className="font-data text-[10px] leading-relaxed text-sidebar-foreground/45">{health.isLoading ? 'checking health endpoint…' : health.isError ? 'API signal unavailable' : 'runtime model · live endpoint'}</p>
        </div>
        <button onClick={toggleTheme} data-testid="button-toggle-theme" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-semibold text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? 'Use light canvas' : 'Use dark canvas'}
        </button>
      </div>
    </aside>
  );

  return <div className="grain min-h-[100dvh] bg-background text-foreground">
    <div className="flex min-h-[100dvh]">
      <Sidebar />
      {mobileOpen && <><div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" aria-hidden="true" /><Sidebar mobile /></>}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation" className="rounded-lg p-2 hover:bg-muted lg:hidden"><Menu size={20} /></button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Workspace</span><ChevronRight size={13} /><span className="font-semibold text-foreground">{location === '/' ? 'Overview' : location.replace('/', '').replace('-', ' ')}</span></div>
            <span className="font-data text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:hidden">AQUACROP / {location === '/' ? 'HOME' : location.slice(1).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground md:flex"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Demo dataset</div>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/40 font-data text-[11px] font-medium text-accent-foreground">AR</div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1520px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  </div>;
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <div className="animate-rise">
      <div className="mb-3 flex items-center gap-2 font-data text-[10px] font-medium uppercase tracking-[0.2em] text-primary"><span className="h-px w-5 bg-accent" />{eyebrow}</div>
      <h1 className="font-display text-4xl leading-[0.95] tracking-[-0.035em] text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    {action && <div className="animate-rise animate-rise-delay-1 shrink-0">{action}</div>}
  </div>;
}

export function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-sm',
    secondary: 'border border-border bg-card text-foreground hover-elevate',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    danger: 'border border-destructive/25 bg-destructive/5 text-destructive hover:bg-destructive/10',
  };
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all disabled:pointer-events-none disabled:opacity-45 ${styles[variant]} ${className}`}>{children}</button>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-card-border bg-card shadow-sm ${className}`}>{children}</section>;
}

export function SectionLabel({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="font-data text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{children}</h2>{aside}</div>;
}

export function CategoryBadge({ category }: { category?: string }) {
  const value = category?.toUpperCase() ?? '—';
  const style = value === 'LOW' ? 'bg-primary/10 text-primary' : value === 'HIGH' ? 'bg-destructive/10 text-destructive' : 'bg-accent/25 text-accent-foreground';
  return <span data-testid={`status-category-${value.toLowerCase()}`} className={`inline-flex rounded-full px-2 py-1 font-data text-[10px] font-medium tracking-[0.08em] ${style}`}>{value}</span>;
}

export function LoadingBlock({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3" data-testid="status-loading">{Array.from({ length: rows }).map((_, index) => <div key={index} className="skeleton h-12 rounded-lg" />)}</div>;
}

export function ErrorBlock({ message = 'The field feed could not be reached.', onRetry }: { message?: string; onRetry?: () => void }) {
  return <div data-testid="status-error" className="rounded-xl border border-destructive/25 bg-destructive/5 p-5"><p className="text-sm font-bold text-destructive">A signal dropped</p><p className="mt-1 text-xs text-muted-foreground">{message}</p>{onRetry && <Button onClick={onRetry} variant="danger" className="mt-4" data-testid="button-retry">Try again</Button>}</div>;
}

export function EmptyBlock({ title, body }: { title: string; body: string }) {
  return <div data-testid="status-empty" className="rounded-xl border border-dashed border-border bg-card/60 p-10 text-center"><Network className="mx-auto mb-3 text-muted-foreground/50" size={25} /><p className="text-sm font-bold">{title}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{body}</p></div>;
}

export function MetricValue({ value, unit = '', label, accent = false }: { value: string | number; unit?: string; label: string; accent?: boolean }) {
  return <div data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}><p className="font-data text-[10px] uppercase tracking-[0.13em] text-muted-foreground">{label}</p><p className={`mt-2 font-display text-3xl tracking-[-0.04em] ${accent ? 'text-primary' : 'text-foreground'}`}>{value}<span className="ml-1 font-sans text-sm font-semibold tracking-normal text-muted-foreground">{unit}</span></p></div>;
}

export function fmt(value: number | undefined, digits = 1) {
  return typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—';
}