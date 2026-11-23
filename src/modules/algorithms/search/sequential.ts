import { SearchTrace } from "./common";
import type { SearchOptions, SearchResult } from "../types";

export function sequentialSearch(
  input: number[],
  key: number,
  options: SearchOptions = {},
): SearchResult {
  const trace = new SearchTrace(options);
  const start = performance.now();
  let foundIndex = -1;

  for (let i = 0; i < input.length; i++) {
    trace.compare(i);
    if (input[i] === key) {
      foundIndex = i;
      trace.found(i);
      break;
    }
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
