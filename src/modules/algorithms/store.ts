import { create } from "zustand";
import type { SortingState } from "./types/storeTypes";
import { generateArray, mulberry32 } from "./utils/generate";

export const useSortingStore = create<SortingState>((set, get) => ({
  vectorConfig: {
    actualSize: 50,
    maxValue: 1000,
  },
  inputFormat: "random",
  currentArray: generateArray(50, "random", 1000, mulberry32(1)),
  setSize: (n) =>
    set((state) => ({
      vectorConfig: { ...state.vectorConfig, actualSize: n },
    })),
  setInputFormat: (inputFormat) => set({ inputFormat }),
  setArray: (currentArray) => set({ currentArray }),
  generate: () => {
    const { actualSize, maxValue } = get().vectorConfig;
    const { inputFormat } = get();
    set({ currentArray: generateArray(actualSize, inputFormat, maxValue) });
  },
}));
