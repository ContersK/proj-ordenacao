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
  this.recordSteps = options.recordSteps ?? false 
  this.maxSteps = options.maxSteps ?? 20_000
   }

  compare(array: number[], i: number, j: number): void {
  this.comparisons += 1;
  this.pushStep(array, {compare: [i,j]} )

  }
  swap(array: number[], i: number, j: number): void {}

  write(array: number[], index: number, value: number): void{}
  recursive(): void {}

  private pushStep(array: number[], extra: Omit<SortStep, "array">): void {}
  
}