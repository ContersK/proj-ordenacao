import type {
  BenchmarkProgress,
  InputFormat,
  SearchBenchmarkConfig,
  SearchBenchmarkRow,
  SortingBenchmarkConfig,
  SortingBenchmarkRow,
} from "../types";
import { searchAlgorithms } from "../search";
import { sortingAlgorithms } from "../sorting";
import {
  generateArray,
  generateSearchArray,
  inputFormats,
  keyForPosition,
  keyPositions,
  mulberry32,
} from "./generate";

export function parseSizes(value: string): number[] {
  const parsed = value
    .split(/[,;\s]+/)
    .map((part) => Number(part))
    .filter((size) => Number.isSafeInteger(size) && size > 0);

  return Array.from(new Set(parsed)).sort((a, b) => a - b);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function formatLabel(format: InputFormat): string {
  return inputFormats.find((item) => item.id === format)?.label ?? format;
}

function positionLabel(position: string): string {
  return keyPositions.find((item) => item.id === position)?.label ?? position;
}

export async function runSortingBenchmark(
  config: SortingBenchmarkConfig,
  onProgress?: BenchmarkProgress,
): Promise<SortingBenchmarkRow[]> {
  const rows: SortingBenchmarkRow[] = [];
  const repetitions = Math.max(1, Math.floor(config.repetitions));
  const total =
    config.algorithms.length *
    config.formats.length *
    config.sizes.length *
    repetitions;
  const seed = config.seed ?? 12345;
  let done = 0;

  if (config.sizes.length === 0) return rows;

  for (const format of config.formats) {
    for (const size of config.sizes) {
      const base = generateArray(
        size,
        format,
        config.maxValue,
        mulberry32(seed + size),
      );

      for (const algorithmId of config.algorithms) {
        const entry = sortingAlgorithms[algorithmId];
        const times: number[] = [];
        let metrics = {
          comparisons: 0,
          swaps: 0,
          writes: 0,
          recursiveCalls: 0,
        };

        for (let run = 0; run < repetitions; run++) {
          const result = entry.run(base, { recordSteps: false });
          times.push(result.metrics.timeMs);
          metrics = {
            comparisons: result.metrics.comparisons,
            swaps: result.metrics.swaps,
            writes: result.metrics.writes,
            recursiveCalls: result.metrics.recursiveCalls,
          };
          done++;
          onProgress?.(done, total);
          await yieldToBrowser();
        }

        rows.push({
          algorithm: algorithmId,
          format,
          size,
          timeMs: median(times),
          ...metrics,
          runs: repetitions,
        });
      }
    }
  }

  return rows;
}

export async function runSearchBenchmark(
  config: SearchBenchmarkConfig,
  onProgress?: BenchmarkProgress,
): Promise<SearchBenchmarkRow[]> {
  const rows: SearchBenchmarkRow[] = [];
  const repetitions = Math.max(1, Math.floor(config.repetitions));
  const total =
    config.algorithms.length *
    config.positions.length *
    config.sizes.length *
    repetitions;
  let done = 0;

  for (const size of config.sizes) {
    const array = generateSearchArray(size);

    for (const position of config.positions) {
      const key = keyForPosition(array, position);

      for (const algorithmId of config.algorithms) {
        const entry = searchAlgorithms[algorithmId];
        const times: number[] = [];
        let comparisons = 0;
        let foundIndex = -1;

        for (let run = 0; run < repetitions; run++) {
          const result = entry.run(array, key, { recordSteps: false });
          times.push(result.metrics.timeMs);
          comparisons = result.metrics.comparisons;
          foundIndex = result.metrics.foundIndex;
          done++;
          onProgress?.(done, total);
          await yieldToBrowser();
        }

        rows.push({
          algorithm: algorithmId,
          position,
          size,
          timeMs: median(times),
          comparisons,
          foundIndex,
          runs: repetitions,
        });
      }
    }
  }

  return rows;
}

export function sortingRowsToCsv(rows: SortingBenchmarkRow[]): string {
  const header = [
    "Algoritmo",
    "Formato",
    "n",
    "Tempo (ms)",
    "Comparações",
    "Trocas",
    "Escritas",
    "Chamadas recursivas",
    "Execuções",
  ];

  const lines = rows.map((row) =>
    [
      sortingAlgorithms[row.algorithm].name,
      formatLabel(row.format),
      row.size,
      row.timeMs.toFixed(3),
      row.comparisons,
      row.swaps,
      row.writes,
      row.recursiveCalls,
      row.runs,
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export function searchRowsToCsv(rows: SearchBenchmarkRow[]): string {
  const header = [
    "Algoritmo",
    "Posição da chave",
    "n",
    "Tempo (ms)",
    "Comparações",
    "Índice encontrado",
    "Execuções",
  ];

  const lines = rows.map((row) =>
    [
      searchAlgorithms[row.algorithm].name,
      positionLabel(row.position),
      row.size,
      row.timeMs.toFixed(3),
      row.comparisons,
      row.foundIndex,
      row.runs,
    ].join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
