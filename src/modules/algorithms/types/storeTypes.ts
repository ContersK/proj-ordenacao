import type { InputFormat } from "./benchmarkTypes";

export type VectorConfig = {
  actualSize: number;
  maxValue: number;
};

export type SortingState = {
  vectorConfig: VectorConfig;
  inputFormat: InputFormat;
  currentArray: number[];
  setSize: (n: number) => void;
  setInputFormat: (format: InputFormat) => void;
  setArray: (array: number[]) => void;
  generate: () => void;
};
