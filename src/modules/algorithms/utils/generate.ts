import type { InputFormat, KeyPosition } from "../types";

export const inputFormats: { id: InputFormat; label: string }[] = [
  { id: "random", label: "Aleatório" },
  { id: "ascending", label: "Crescente" },
  { id: "descending", label: "Decrescente" },
  { id: "nearlySorted", label: "Quase ordenado" },
  { id: "repeated", label: "Com repetidos" },
];

export const keyPositions: { id: KeyPosition; label: string }[] = [
  { id: "start", label: "Início" },
  { id: "middle", label: "Meio" },
  { id: "end", label: "Fim" },
  { id: "absent", label: "Ausente" },
];

export function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateArray(
  size: number,
  format: InputFormat,
  maxValue: number,
  random: () => number = Math.random,
): number[] {
  const n = Math.max(0, size);

  switch (format) {
    case "ascending":
      return Array.from({ length: n }, (_, i) => i + 1);
    case "descending":
      return Array.from({ length: n }, (_, i) => n - i);
    case "nearlySorted": {
      const arr = Array.from({ length: n }, (_, i) => i + 1);
      const changes = Math.max(1, Math.floor(n * 0.05));
      for (let k = 0; k < changes && n > 1; k++) {
        const i = Math.floor(random() * (n - 1));
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
      return arr;
    }
    case "repeated": {
      const distinct = Math.max(2, Math.min(10, Math.floor(n / 5) || 2));
      return Array.from({ length: n }, () =>
        Math.floor(random() * distinct),
      );
    }
    default:
      return Array.from({ length: n }, () =>
        Math.floor(random() * Math.max(1, maxValue)),
      );
  }
}

export function generateSearchArray(size: number): number[] {
  return Array.from({ length: Math.max(0, size) }, (_, i) => i + 1);
}

export function keyForPosition(
  array: number[],
  position: KeyPosition,
): number {
  if (array.length === 0) return 1;

  switch (position) {
    case "start":
      return array[0];
    case "middle":
      return array[Math.floor(array.length / 2)];
    case "end":
      return array[array.length - 1];
    default:
      return array[array.length - 1] + 1;
  }
}
