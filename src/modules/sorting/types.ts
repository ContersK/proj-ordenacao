//
export type SortStep = {
  array: number[];
  compare?: [number, number];
  swap?: [number, number];
};

export type SortMetrics = {
  comparisons: number;
  swaps: number;
};

export type SortResult = {
  steps: SortStep[];
  metrics: SortMetrics;
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
};
