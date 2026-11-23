"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SortStep } from "@/modules/algorithms/types";

const TARGET_FRAMES = 300;

export function useSortPlayback(
  input: number[],
  steps: SortStep[],
  speedMs: number,
) {
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [array, setArray] = useState<number[]>(input);
  const working = useRef<number[]>([...input]);
  const indexRef = useRef(-1);

  const stride = Math.max(1, Math.ceil(steps.length / TARGET_FRAMES));
  const active =
    playing && steps.length > 0 && index < steps.length - 1;

  const reset = useCallback(() => {
    working.current = [...input];
    indexRef.current = -1;
    setIndex(-1);
    setArray([...input]);
    setPlaying(false);
  }, [input]);

  const load = useCallback((nextInput: number[], nextSteps: SortStep[]) => {
    working.current = [...nextInput];
    indexRef.current = -1;
    setIndex(-1);
    setArray([...nextInput]);
    setPlaying(nextSteps.length > 0);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      if (steps.length === 0) {
        reset();
        return;
      }

      const clamped = Math.max(-1, Math.min(steps.length - 1, target));
      const work = working.current;

      while (indexRef.current < clamped) {
        indexRef.current += 1;
        const step = steps[indexRef.current];
        if (step.type === "swap") {
          [work[step.i], work[step.j]] = [work[step.j], work[step.i]];
        } else if (step.type === "write") {
          work[step.index] = step.value;
        }
      }

      while (indexRef.current > clamped) {
        const step = steps[indexRef.current];
        if (step.type === "swap") {
          [work[step.i], work[step.j]] = [work[step.j], work[step.i]];
        } else if (step.type === "write") {
          work[step.index] = step.previous;
        }
        indexRef.current -= 1;
      }

      setIndex(indexRef.current);
      setArray([...work]);
    },
    [steps, reset],
  );

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (indexRef.current >= steps.length - 1) goTo(-1);
    setPlaying(true);
  }, [steps.length, goTo]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    if (active) setPlaying(false);
    else play();
  }, [active, play]);

  const next = useCallback(() => {
    setPlaying(false);
    goTo(indexRef.current + stride);
  }, [goTo, stride]);

  const prev = useCallback(() => {
    setPlaying(false);
    goTo(indexRef.current - stride);
  }, [goTo, stride]);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      goTo(indexRef.current + stride);
    }, speedMs);

    return () => clearTimeout(timer);
  }, [active, index, speedMs, stride, goTo]);

  return {
    index,
    array,
    playing: active,
    stride,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    goTo,
    load,
  };
}
