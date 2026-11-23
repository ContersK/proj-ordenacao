import type { AlgorithmId, SortingEntry } from "../types";
import { selectionSort } from "./selection";
import { bubbleSort } from "./bubble";
import { insertionSort } from "./insertion";
import { mergeSort } from "./merge";
import { quickSort } from "./quick";
import { heapSort } from "./heap";

export const sortingAlgorithms: Record<AlgorithmId, SortingEntry> = {
  selection: {
    id: "selection",
    name: "Selection Sort",
    description:
      "Percorre o vetor buscando o menor elemento e o coloca na posição correta.",
    complexities: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
    dominantOperation: "comparações e trocas",
    recurrence: "T(n) = T(n-1) + Θ(n)",
    run: selectionSort,
  },
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    description:
      "Compara elementos vizinhos e troca quando estão fora de ordem, empurrando os maiores para o fim.",
    complexities: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
    dominantOperation: "comparações e trocas",
    recurrence: "T(n) = T(n-1) + Θ(n)",
    run: bubbleSort,
  },
  insertion: {
    id: "insertion",
    name: "Insertion Sort",
    description:
      "Insere cada elemento na posição correta dentro da parte já ordenada do vetor.",
    complexities: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    stable: true,
    inPlace: true,
    dominantOperation: "comparações e trocas",
    recurrence: "T(n) = T(n-1) + Θ(n)",
    run: insertionSort,
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    description:
      "Divide o vetor em metades, ordena cada metade recursivamente e intercala os resultados.",
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
    },
    stable: true,
    inPlace: false,
    dominantOperation: "comparações e escritas",
    recurrence: "T(n) = 2T(n/2) + Θ(n)",
    run: mergeSort,
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    description:
      "Escolhe um pivô, particiona o vetor e ordena as partições recursivamente.",
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
    },
    stable: false,
    inPlace: true,
    dominantOperation: "comparações e trocas",
    recurrence: "T(n) = T(k) + T(n-k-1) + Θ(n)",
    run: quickSort,
  },
  heap: {
    id: "heap",
    name: "Heap Sort",
    description:
      "Constrói um heap máximo e extrai o maior elemento repetidamente para o fim do vetor.",
    complexities: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
    },
    stable: false,
    inPlace: true,
    dominantOperation: "comparações e trocas",
    recurrence: "Construção O(n) + n extrações O(log n)",
    run: heapSort,
  },
};

export const sortingList = Object.values(sortingAlgorithms);
