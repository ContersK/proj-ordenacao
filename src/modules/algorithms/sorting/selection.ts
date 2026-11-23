import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

export function selectionSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      trace.compare(j, min);
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) trace.swap(arr, i, min);
  }

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
