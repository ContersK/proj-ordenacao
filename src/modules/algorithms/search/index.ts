import type { SearchAlgorithmId, SearchEntry } from "../types";
import { sequentialSearch } from "./sequential";
import { binarySearch } from "./binary";

export const searchAlgorithms: Record<SearchAlgorithmId, SearchEntry> = {
  sequential: {
    id: "sequential",
    name: "Busca Sequencial",
    description:
      "Percorre o vetor do início ao fim comparando cada elemento com a chave.",
    complexities: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
    requiresSorted: false,
    dominantOperation: "comparações",
    cost: "C(n) = n",
    run: sequentialSearch,
  },
  binary: {
    id: "binary",
    name: "Busca Binária",
    description:
      "Divide o intervalo de busca pela metade a cada comparação. Exige vetor ordenado.",
    complexities: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
    },
    requiresSorted: true,
    dominantOperation: "comparações",
    cost: "C(n) = ⌊log₂ n⌋ + 1",
    run: binarySearch,
  },
};

export const searchList = Object.values(searchAlgorithms);
