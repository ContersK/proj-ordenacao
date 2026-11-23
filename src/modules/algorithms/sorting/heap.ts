import { Trace } from "./common";
import type { SortOptions, SortResult } from "../types";

function heapify(
  arr: number[],
  size: number,
  index: number,
  trace: Trace,
): void {
  trace.recursive();

  let largest = index;
  const left = 2 * index + 1;
  const right = 2 * index + 2;

  if (left < size) {
    trace.compare(left, largest);
    if (arr[left] > arr[largest]) largest = left;
  }

  if (right < size) {
    trace.compare(right, largest);
    if (arr[right] > arr[largest]) largest = right;
  }

  if (largest !== index) {
    trace.swap(arr, index, largest);
    heapify(arr, size, largest, trace);
  }
}

export function heapSort(
  input: number[],
  options: SortOptions = {},
): SortResult {
  const arr = [...input];
  const trace = new Trace(options);
  const start = performance.now();

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i, trace);
  }

  for (let end = arr.length - 1; end > 0; end--) {
    trace.swap(arr, 0, end);
    heapify(arr, end, 0, trace);
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
