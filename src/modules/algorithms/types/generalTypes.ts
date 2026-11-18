export type AnimationConfig = {
  speedMs: number;
  status: "idle" | "running" | "paused" | "finished";
  currentStep: number;
};
