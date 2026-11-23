import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

function partition(
  arr: number[],
  low: number,
  high: number,
  trace: Trace,
): number {
  const mid = Math.floor((low + high) / 2);

  if (low !== mid) {
    trace.compare(low, mid);
    if (arr[low] > arr[mid]) trace.swap(arr, low, mid);
  }

  trace.compare(mid, high);
  if (arr[mid] > arr[high]) trace.swap(arr, mid, high);

  if (low !== mid) {
    trace.compare(low, mid);
    if (arr[low] > arr[mid]) trace.swap(arr, low, mid);
  }

  if (mid !== high) trace.swap(arr, mid, high);
  const pivot = arr[high];
  let i = low;

  for (let j = low; j < high; j++) {
    trace.compare(j, high);
    if (arr[j] < pivot) {
      if (i !== j) trace.swap(arr, i, j);
      i++;
    }
  }

  if (i !== high) trace.swap(arr, i, high);
  return i;
}

function quickSortRange(
  arr: number[],
  low: number,
  high: number,
  trace: Trace,
): void {
  trace.recursive();

  while (low < high) {
    const pivotIndex = partition(arr, low, high, trace);

    if (pivotIndex - low < high - pivotIndex) {
      quickSortRange(arr, low, pivotIndex - 1, trace);
      low = pivotIndex + 1;
    } else {
      quickSortRange(arr, pivotIndex + 1, high, trace);
      high = pivotIndex - 1;
    }
  }
}

export function quickSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  quickSortRange(arr, 0, arr.length - 1, trace);

  return {
    steps: trace.steps,
    array: arr,
    metrics: {
      comparisons: trace.comparisons,
      swaps: trace.swaps,
      writes: trace.writes,
      recursiveCalls: trace.recursiveCalls,
      size: input.length,
      timeMs: performance.now() - start,
    },
  };
}
