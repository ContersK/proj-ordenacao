"use client";

import { useCallback, useEffect, useState } from "react";

const TARGET_FRAMES = 300;

export function useStepPlayer(total: number, speedMs: number) {
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const stride = Math.max(1, Math.ceil(total / TARGET_FRAMES));
  const active = playing && total > 0 && index < total - 1;

  const load = useCallback((nextTotal: number) => {
    setIndex(-1);
    setPlaying(nextTotal > 0);
  }, []);

  const play = useCallback(() => {
    if (total === 0) return;
    setIndex((current) => (current >= total - 1 ? -1 : current));
    setPlaying(true);
  }, [total]);

  const pause = useCallback(() => setPlaying(false), []);

  const toggle = useCallback(() => {
    if (active) setPlaying(false);
    else play();
  }, [active, play]);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((current) => Math.min(total - 1, current + stride));
  }, [total, stride]);

  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((current) => Math.max(-1, current - stride));
  }, [stride]);

  const reset = useCallback(() => {
    setIndex(-1);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!active) return;

    const timer = setTimeout(() => {
      setIndex((current) => Math.min(total - 1, current + stride));
    }, speedMs);

    return () => clearTimeout(timer);
  }, [active, index, total, speedMs, stride]);

  return {
    index,
    playing: active,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    load,
    stride,
  };
}
