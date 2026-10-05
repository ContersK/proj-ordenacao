export type VectorConfig = {
  maxSize: number;
  actualSize: number;
  maxValue: number;
  minSize: number;
};

export type SortingState = {
  vectorConfig: VectorConfig;
  currentArray: number[];
  setSize: (n: number) => void;
  generate: () => void;
};
