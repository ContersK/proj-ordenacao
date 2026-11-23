export type SortStep =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "write"; index: number; value: number; previous: number };

export type SortMetrics = {
  comparisons: number;
  size: number;
  swaps: number;
  writes: number;
  timeMs: number;
  recursiveCalls: number;
};

export type SortResult = {
  steps: SortStep[];
  metrics: SortMetrics;
  array: number[];
};

export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "merge"
  | "quick"
  | "heap";

export type SortingAlgorithm = {
  id: AlgorithmId;
  name: string;
  description: string;
  complexities: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  stable: boolean;
  inPlace: boolean;
  dominantOperation: string;
  recurrence: string;
};

export type SortOptions = {
  recordSteps?: boolean;
};

export type SortingRun = (
  input: number[],
  options?: SortOptions,
) => SortResult;

export type SortingEntry = SortingAlgorithm & {
  run: SortingRun;
};
