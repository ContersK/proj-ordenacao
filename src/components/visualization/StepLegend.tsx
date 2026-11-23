type StepLegendProps = {
  mode: "sorting" | "search";
};

const sortingItems = [
  { color: "bg-warning", label: "Comparação" },
  { color: "bg-error", label: "Troca" },
  { color: "bg-info", label: "Escrita" },
  { color: "bg-success", label: "Ordenado" },
];

const searchItems = [
  { color: "bg-warning", label: "Comparação" },
  { color: "bg-success", label: "Encontrado" },
  { color: "bg-base-content/20", label: "Fora do intervalo" },
];

export function StepLegend({ mode }: StepLegendProps) {
  const items = mode === "sorting" ? sortingItems : searchItems;

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/70">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
