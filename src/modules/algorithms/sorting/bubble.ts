import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

export function bubbleSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - 1 - i; j++) {
      trace.compare(j, j + 1);
      if (arr[j] > arr[j + 1]) {
        trace.swap(arr, j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
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
