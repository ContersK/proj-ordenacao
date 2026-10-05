export type VectorConfig = {
  maxSize: number;
  actualSize: number;
  maxValue: number;
};

export type AnimationConfig = {
  speedMs: number;
  status: "idle" | "running" | "paused" | "finished";
  currentStep: number;
};
