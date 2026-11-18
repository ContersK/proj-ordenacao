import type { SortStep, SortOptions } from "../types";

export class Trace {
  comparisons = 0;
  swaps = 0;
  writes = 0;
  recursiveCalls = 0;
  readonly steps: SortStep[] = [];

  private readonly recordSteps: boolean;
  private readonly maxSteps: number;

  constructor(options: SortOptions = {}) {
    this.recordSteps = options.recordSteps ?? false;
    this.maxSteps = options.maxSteps ?? 20_000;
  }

  compare(array: number[], i: number, j: number): void {
    this.comparisons += 1;
    this.pushStep(array, { compare: [i, j] });
  }
  swap(array: number[], i: number, j: number): void {
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
    this.swaps += 1;
    this.writes += 2;
    this.pushStep(array, { swap: [i, j] });
  }

  write(array: number[], index: number, value: number): void {
    array[index] = value;
    this.writes += 1;
    this.pushStep(array, { write: index });
  }
  recursive(): void {
    this.recursiveCalls += 1;
  }

  private pushStep(array: number[], extra: Omit<SortStep, "array">): void {
    if (!this.recordSteps) return;
    if (this.steps.length >= this.maxSteps) return;
    this.steps.push({ array: [...array], ...extra });
  }
}
