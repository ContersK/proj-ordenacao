import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

export function insertionSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      trace.compare(j - 1, j);
      if (arr[j - 1] <= arr[j]) break;
      trace.swap(arr, j - 1, j);
      j--;
    }
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
