import type { SortOptions, SortStep } from "../types";

export class Trace {
  comparisons = 0;
  swaps = 0;
  writes = 0;
  recursiveCalls = 0;
  readonly steps: SortStep[] = [];

  private readonly recordSteps: boolean;

  constructor(options: SortOptions = {}) {
    this.recordSteps = options.recordSteps ?? false;
  }

  compare(i: number, j: number): void {
    this.comparisons += 1;
    this.push({ type: "compare", i, j });
  }

  swap(array: number[], i: number, j: number): void {
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
    this.swaps += 1;
    this.writes += 2;
    this.push({ type: "swap", i, j });
  }

  write(array: number[], index: number, value: number): void {
    const previous = array[index];
    array[index] = value;
    this.writes += 1;
    this.push({ type: "write", index, value, previous });
  }

  recursive(): void {
    this.recursiveCalls += 1;
  }

  private push(step: SortStep): void {
    if (!this.recordSteps) return;
    this.steps.push(step);
  }
}
