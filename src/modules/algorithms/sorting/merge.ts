import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

function merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  trace: Trace,
): void {
  const temp: number[] = [];
  let i = left;
  let j = mid + 1;

  while (i <= mid && j <= right) {
    trace.compare(i, j);
    if (arr[i] <= arr[j]) temp.push(arr[i++]);
    else temp.push(arr[j++]);
  }

  while (i <= mid) temp.push(arr[i++]);
  while (j <= right) temp.push(arr[j++]);

  for (let k = 0; k < temp.length; k++) {
    trace.write(arr, left + k, temp[k]);
  }
}

function mergeSortRange(
  arr: number[],
  left: number,
  right: number,
  trace: Trace,
): void {
  trace.recursive();
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergeSortRange(arr, left, mid, trace);
  mergeSortRange(arr, mid + 1, right, trace);
  merge(arr, left, mid, right, trace);
}

export function mergeSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  mergeSortRange(arr, 0, arr.length - 1, trace);

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
