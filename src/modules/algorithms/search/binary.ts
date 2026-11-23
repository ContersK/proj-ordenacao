import { SearchTrace } from "./common";
import type { SearchOptions, SearchResult } from "../types";

export function binarySearch(
  input: number[],
  key: number,
  options: SearchOptions = {},
): SearchResult {
  const trace = new SearchTrace(options);
  const start = performance.now();
  let low = 0;
  let high = input.length - 1;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    trace.compare(mid, low, high);

    if (input[mid] === key) {
      foundIndex = mid;
      trace.found(mid);
      break;
    }

    if (input[mid] < key) low = mid + 1;
    else high = mid - 1;
  }

  return {
    steps: trace.steps,
    metrics: {
      comparisons: trace.comparisons,
      size: input.length,
      timeMs: performance.now() - start,
      foundIndex,
    },
  };
}
