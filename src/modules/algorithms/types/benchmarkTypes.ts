import type { AlgorithmId } from "./algorithmTypes";
import type { KeyPosition, SearchAlgorithmId } from "./searchTypes";

export type InputFormat =
  | "random"
  | "ascending"
  | "descending"
  | "nearlySorted"
  | "repeated";

export type SortingBenchmarkRow = {
  algorithm: AlgorithmId;
  format: InputFormat;
  size: number;
  timeMs: number;
  comparisons: number;
  swaps: number;
  writes: number;
  recursiveCalls: number;
  runs: number;
};

export type SearchBenchmarkRow = {
  algorithm: SearchAlgorithmId;
  position: KeyPosition;
  size: number;
  timeMs: number;
  comparisons: number;
  foundIndex: number;
  runs: number;
};

export type BenchmarkProgress = (done: number, total: number) => void;

export type SortingBenchmarkConfig = {
  algorithms: AlgorithmId[];
  formats: InputFormat[];
  sizes: number[];
  repetitions: number;
  maxValue: number;
  seed?: number;
};

export type SearchBenchmarkConfig = {
  algorithms: SearchAlgorithmId[];
  positions: KeyPosition[];
  sizes: number[];
  repetitions: number;
  seed?: number;
};
