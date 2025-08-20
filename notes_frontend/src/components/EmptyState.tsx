import React from "react";

// PUBLIC_INTERFACE
export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  /** Minimal reusable empty state component. */
  return (
    <div className="text-center text-slate-500 py-10">
      <p className="text-base font-medium">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
