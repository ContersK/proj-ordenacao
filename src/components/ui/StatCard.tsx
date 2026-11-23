import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, unit, icon }: StatCardProps) {
  return (
    <div className="min-w-0 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-xs text-base-content/55">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1 truncate font-mono text-lg font-medium leading-tight">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-normal text-base-content/55">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
