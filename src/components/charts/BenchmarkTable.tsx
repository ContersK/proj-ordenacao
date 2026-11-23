type Column = {
  key: string;
  label: string;
  align?: "left" | "right";
};

type BenchmarkTableProps = {
  columns: Column[];
  rows: Record<string, string | number>[];
  emptyMessage?: string;
  maxHeight?: string;
};

export function BenchmarkTable({
  columns,
  rows,
  emptyMessage = "Nenhum resultado ainda.",
  maxHeight = "420px",
}: BenchmarkTableProps) {
  return (
    <div
      className="overflow-auto border border-base-300"
      style={{ maxHeight }}
    >
      <table className="table table-sm">
        <thead className="sticky top-0 z-10 bg-base-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={
                  column.align === "right" ? "text-right" : undefined
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-sm text-base-content/60"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={
                      column.align === "right"
                        ? "text-right font-mono"
                        : undefined
                    }
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
