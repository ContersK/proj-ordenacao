export type SortStep = {
  //transformar em evento leve com indice + types
  array: number[];
  compare?: [number, number];
  swap?: [number, number];
};

export type SortMetrics = {
  comparisons: number;
  size: number;
  swaps: number;
  writes: number;
  timeMs: number;
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
  algorithmUsed: AlgorithmId;
  name: string;
  description: string;
  complexities: {
    best: string;
    average: string;
    worst: string;
  };
  stable: boolean;
  inPlace: boolean;
};

export type VectorConfig = {
  maxSize: number;
  actualSize: number;
  maxValue: number;
};

export type AnimationConfig = {
  speedMs: number;
  status: "idle" | "running" | "paused" | "finished";
  currentStep: number;
};

export type BenchmarkResult = {
  algorithmUsed: AlgorithmId;
  metrics: SortMetrics;
};
