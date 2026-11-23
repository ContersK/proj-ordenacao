export type SearchStep =
  | { type: "compare"; index: number; low?: number; high?: number }
  | { type: "found"; index: number };

export type SearchMetrics = {
  comparisons: number;
  size: number;
  timeMs: number;
  foundIndex: number;
};

export type SearchResult = {
  steps: SearchStep[];
  metrics: SearchMetrics;
};

export type SearchAlgorithmId = "sequential" | "binary";

export type KeyPosition = "start" | "middle" | "end" | "absent";

export type SearchAlgorithm = {
  id: SearchAlgorithmId;
  name: string;
  description: string;
  complexities: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  requiresSorted: boolean;
  dominantOperation: string;
  cost: string;
};

export type SearchOptions = {
  recordSteps?: boolean;
};

export type SearchRun = (
  input: number[],
  key: number,
  options?: SearchOptions,
) => SearchResult;

export type SearchEntry = SearchAlgorithm & {
  run: SearchRun;
};
