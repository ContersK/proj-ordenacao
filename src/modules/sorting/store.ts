import { SortingState } from "./types/storeTypes";
import { create } from "zustand";

export const useSortingStore = create<SortingState>((set, get) => ({
  vectorConfig: {
    maxSize: 10000,
    actualSize: 50,
    maxValue: 1000,
    minSize:50
  },
  currentArray: [],
  setSize: (n) =>
    set((state) => ({
      vectorConfig: { ...state.vectorConfig, actualSize: n },
    })),
  generate: () => {
    const { actualSize, maxValue } = get().vectorConfig;
    const arr = Array.from({ length: actualSize }, () =>
      Math.floor(Math.random() * maxValue),
    );
    set({ currentArray: arr });
  },
}));
