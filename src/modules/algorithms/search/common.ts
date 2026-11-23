import type { SearchOptions, SearchStep } from "../types";

export class SearchTrace {
  comparisons = 0;
  readonly steps: SearchStep[] = [];

  private readonly recordSteps: boolean;

  constructor(options: SearchOptions = {}) {
    this.recordSteps = options.recordSteps ?? false;
  }

  compare(index: number, low?: number, high?: number): void {
    this.comparisons += 1;
    this.push({ type: "compare", index, low, high });
  }

  found(index: number): void {
    this.push({ type: "found", index });
  }

  private push(step: SearchStep): void {
    if (!this.recordSteps) return;
    this.steps.push(step);
  }
}
