import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-foreground">{label}</span>{children}{hint && <span className="mt-1.5 block text-[10px] text-muted-foreground">{hint}</span>}</label>;
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`} />;
}

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 ${className}`} />;
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}