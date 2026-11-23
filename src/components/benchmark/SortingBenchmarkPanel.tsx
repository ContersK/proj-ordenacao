"use client";

import { useMemo, useState } from "react";
import { Download, FlaskConical, LoaderCircle } from "lucide-react";
import { BenchmarkTable } from "@/components/charts/BenchmarkTable";
import { SectionCard } from "@/components/ui/SectionCard";
import { ChartCard } from "@/shared/ui/ChartCard";
import { toggleValue } from "@/shared/lib/collections";
import {
  downloadCsv,
  formatInt,
  formatMs,
  inputFormats,
  parseSizes,
  runSortingBenchmark,
  sortingAlgorithms,
  sortingList,
  sortingRowsToCsv,
} from "@/modules/algorithms";
import type {
  AlgorithmId,
  InputFormat,
  SortingBenchmarkRow,
} from "@/modules/algorithms";

const palette = [
  "#166a58",
  "#2f6f9f",
  "#2f7d4f",
  "#b86b12",
  "#b83b32",
  "#7a4f9a",
];

const columns: {
  key: string;
  label: string;
  align?: "left" | "right";
}[] = [
  { key: "algorithm", label: "Algoritmo" },
  { key: "format", label: "Formato" },
  { key: "size", label: "n", align: "right" },
  { key: "time", label: "Tempo", align: "right" },
  { key: "comparisons", label: "Comparações", align: "right" },
  { key: "swaps", label: "Trocas", align: "right" },
  { key: "writes", label: "Escritas", align: "right" },
  { key: "recursiveCalls", label: "Recursivas", align: "right" },
];

export function SortingBenchmarkPanel() {
  const [sizesInput, setSizesInput] = useState("100, 500, 1000, 5000");
  const [selected, setSelected] = useState<AlgorithmId[]>([
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
    "heap",
  ]);
  const [formats, setFormats] = useState<InputFormat[]>([
    "random",
    "ascending",
    "descending",
  ]);
  const [repetitions, setRepetitions] = useState(3);
  const [rows, setRows] = useState<SortingBenchmarkRow[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState("");

  const sizes = useMemo(() => parseSizes(sizesInput), [sizesInput]);
  const canRun =
    sizes.length > 0 && selected.length > 0 && formats.length > 0;

  const chartFormat =
    formats.find((format) =>
      rows.some((row) => row.format === format),
    ) ?? rows[0]?.format;
  const chartFormatLabel =
    inputFormats.find((item) => item.id === chartFormat)?.label ?? "";

  const chartSizes = useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .filter((row) => row.format === chartFormat)
            .map((row) => row.size),
        ),
      ).sort((a, b) => a - b),
    [rows, chartFormat],
  );

  const chartAlgorithms = useMemo(
    () =>
      Array.from(
        new Set(
          rows
            .filter((row) => row.format === chartFormat)
            .map((row) => row.algorithm),
        ),
      ),
    [rows, chartFormat],
  );

  const series = useMemo(
    () =>
      chartAlgorithms.map((id, index) => ({
        key: id,
        label: sortingAlgorithms[id].name,
        color: palette[index % palette.length],
      })),
    [chartAlgorithms],
  );

  const timeData = useMemo(() => {
    if (!chartFormat) return [];

    return chartSizes.map((size) => {
      const point: Record<string, number> = { size };
      for (const id of chartAlgorithms) {
        const row = rows.find(
          (item) =>
            item.algorithm === id &&
            item.format === chartFormat &&
            item.size === size,
        );
        if (row) point[id] = Number(row.timeMs.toFixed(3));
      }
      return point;
    });
  }, [chartSizes, chartAlgorithms, rows, chartFormat]);

  const comparisonData = useMemo(() => {
    if (!chartFormat) return [];

    return chartSizes.map((size) => {
      const point: Record<string, number> = { size };
      for (const id of chartAlgorithms) {
        const row = rows.find(
          (item) =>
            item.algorithm === id &&
            item.format === chartFormat &&
            item.size === size,
        );
        if (row) point[id] = row.comparisons;
      }
      return point;
    });
  }, [chartSizes, chartAlgorithms, rows, chartFormat]);

  const tableRows = useMemo(
    () =>
      rows.map((row) => ({
        algorithm: sortingAlgorithms[row.algorithm].name,
        format:
          inputFormats.find((item) => item.id === row.format)?.label ??
          row.format,
        size: formatInt(row.size),
        time: formatMs(row.timeMs),
        comparisons: formatInt(row.comparisons),
        swaps: formatInt(row.swaps),
        writes: formatInt(row.writes),
        recursiveCalls: formatInt(row.recursiveCalls),
      })),
    [rows],
  );

  const handleRun = async () => {
    if (!canRun || running) return;

    setRunning(true);
    setError("");
    setProgress({ done: 0, total: 0 });

    try {
      const result = await runSortingBenchmark(
        {
          algorithms: selected,
          formats,
          sizes,
          repetitions: Math.max(1, Math.floor(repetitions)),
          maxValue: 1_000_000,
          seed: 12345,
        },
        (done, total) => setProgress({ done, total }),
      );
      setRows(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Falha ao executar o benchmark.",
      );
    } finally {
      setRunning(false);
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="border border-base-300 bg-base-100">
        <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1.5fr)_7rem_auto] md:items-end">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Tamanhos (n)
            <input
              className="input input-bordered w-full font-mono"
              value={sizesInput}
              onChange={(event) => setSizesInput(event.target.value)}
              placeholder="100, 500, 1000, 5000"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium">
            Repetições
            <input
              type="number"
              min={1}
              className="input input-bordered w-full font-mono"
              value={repetitions}
              onChange={(event) =>
                setRepetitions(Number(event.target.value) || 1)
              }
            />
          </label>

          <button
            type="button"
            className="btn btn-primary min-h-10"
            onClick={handleRun}
            disabled={!canRun || running}
          >
            {running ? (
              <LoaderCircle className="animate-spin" size={16} />
            ) : (
              <FlaskConical size={16} />
            )}
            Executar
          </button>
        </div>

        <div className="grid gap-4 border-t border-base-300 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-medium text-base-content/65">
              Algoritmos
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sortingList.map((algorithm) => {
                const active = selected.includes(algorithm.id);
                return (
                  <button
                    key={algorithm.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setSelected((current) =>
                        toggleValue(current, algorithm.id),
                      )
                    }
                    className={`btn btn-sm min-h-9 ${
                      active ? "btn-neutral" : "btn-outline"
                    }`}
                  >
                    {algorithm.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-base-content/65">
              Formatos de entrada
            </p>
            <div className="flex flex-wrap gap-1.5">
              {inputFormats.map((format) => {
                const active = formats.includes(format.id);
                return (
                  <button
                    key={format.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setFormats((current) =>
                        toggleValue(current, format.id),
                      )
                    }
                    className={`btn btn-sm min-h-9 ${
                      active ? "btn-neutral" : "btn-outline"
                    }`}
                  >
                    {format.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {running && (
          <div className="flex items-center gap-3 border-t border-base-300 px-4 py-3">
            <progress
              className="progress progress-primary h-1.5 w-full"
              value={progress?.done ?? 0}
              max={Math.max(1, progress?.total ?? 1)}
            />
            <span className="whitespace-nowrap font-mono text-xs text-base-content/55">
              {progress
                ? `${formatInt(progress.done)}/${formatInt(progress.total)}`
                : "preparando"}
            </span>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="border-t border-error/30 bg-error/5 px-4 py-2 text-xs text-error"
          >
            {error}
          </p>
        )}
      </section>

      {rows.length > 0 && (
        <>
          {chartFormat && (
            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard
                title={`Tempo — ${chartFormatLabel}`}
                data={timeData}
                xKey="size"
                xLabel="n"
                yLabel="tempo (ms)"
                series={series}
              />
              <ChartCard
                title={`Comparações — ${chartFormatLabel}`}
                data={comparisonData}
                xKey="size"
                xLabel="n"
                yLabel="comparações"
                series={series}
              />
            </div>
          )}

          <SectionCard
            title="Resultados"
            actions={
              <button
                type="button"
                className="btn btn-outline btn-sm min-h-9"
                onClick={() =>
                  downloadCsv(
                    "benchmark-ordenacao.csv",
                    sortingRowsToCsv(rows),
                  )
                }
              >
                <Download size={16} />
                Exportar CSV
              </button>
            }
          >
            <BenchmarkTable
              columns={columns}
              rows={tableRows}
              maxHeight="480px"
            />
          </SectionCard>
        </>
      )}
    </div>
  );
}
