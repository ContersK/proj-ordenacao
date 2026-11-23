import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
};

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center">
      {icon && <div className="text-base-content/35">{icon}</div>}
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="max-w-md text-xs leading-relaxed text-base-content/55">
          {description}
        </p>
      )}
    </div>
  );
}
