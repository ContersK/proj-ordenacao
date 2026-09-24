import { VectorConfig } from "./generalTypes";

export type SortingState = {
  vectorConfig: VectorConfig;
  currentArray: number[];
  setSize: (n: number) => void;
  generate: () => void;
};
