import { SortingState } from "./types/storeTypes";
import { create } from "zustand";

export const useSortingStore = create<SortingState>((set, get) => ({
  vectorConfig: {
    maxSize: 300,
    actualSize: 50,
    maxValue: 500,
  },
  currentArray: [],
  setSize: (n) =>
    // set 1 - pro setSize, ele pega o estado atual e atualiza somente o actualSize do vectorConfig
    set((state) => ({
      vectorConfig: { ...state.vectorConfig, actualSize: n },
    })),
  generate: () => {
    // get 1 - ele pega o estado atual do vectorConfig
    const { actualSize, maxValue } = get().vectorConfig;
    //magia negra
    const arr = Array.from({ length: actualSize }, () =>
      Math.floor(Math.random() * maxValue),
    );
    // set 2 - pro generate, ele atualzia somente o currentArray do state
    set({ currentArray: arr });
  },
}));
