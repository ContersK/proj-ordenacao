"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type ArrayBarsProps = {
  array: number[];
  compare?: [number, number] | null;
  swap?: [number, number] | null;
  write?: number | null;
  found?: number | null;
  range?: [number, number] | null;
  finished?: boolean;
};

type Layout = {
  aggregated: boolean;
  bucketCount: number;
  barWidth: number;
  gap: number;
};

type Hover = {
  x: number;
  bucket: number;
  label: string;
};

const fallback = {
  primary: "#166a58",
  warning: "#b86b12",
  error: "#b83b32",
  info: "#2f6f9f",
  success: "#2f7d4f",
  text: "#17211d",
  line: "#d5dfd8",
};

const fullNumber = new Intl.NumberFormat("pt-BR");

function getLayout(length: number, width: number): Layout {
  const individualLimit = Math.max(1, Math.floor(width / 4));
  const aggregated = length > individualLimit;
  const bucketCount = aggregated ? Math.max(1, Math.floor(width / 4)) : length;
  const gap = aggregated ? 0 : length > 120 ? 1 : length > 40 ? 2 : 3;
  const barWidth = aggregated
    ? width / bucketCount
    : Math.max(1, (width - gap * (length - 1)) / length);

  return { aggregated, bucketCount, barWidth, gap };
}

function bucketRange(
  bucket: number,
  bucketCount: number,
  length: number,
): [number, number] {
  const start = Math.floor((bucket * length) / bucketCount);
  const end = Math.max(
    start,
    Math.ceil(((bucket + 1) * length) / bucketCount) - 1,
  );
  return [start, end];
}

function containsRange(
  bucket: number,
  bucketCount: number,
  length: number,
  index: number,
): boolean {
  const [start, end] = bucketRange(bucket, bucketCount, length);
  return index >= start && index <= end;
}

export function ArrayBars({
  array,
  compare,
  swap,
  write,
  found,
  range,
  finished = false,
}: ArrayBarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Hover | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const styles = getComputedStyle(canvas);
    const css = (name: string, value: string) =>
      styles.getPropertyValue(name).trim() || value;

    const colors = {
      primary: css("--color-primary", fallback.primary),
      warning: css("--color-warning", fallback.warning),
      error: css("--color-error", fallback.error),
      info: css("--color-info", fallback.info),
      success: css("--color-success", fallback.success),
      text: css("--color-base-content", fallback.text),
      line: css("--color-base-300", fallback.line),
    };

    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    for (const ratio of [0.25, 0.5, 0.75]) {
      const y = Math.round(height * ratio) + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(Math.round(width / 2) + 0.5, 0);
    ctx.lineTo(Math.round(width / 2) + 0.5, height);
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (array.length === 0) {
      ctx.fillStyle = colors.text;
      ctx.globalAlpha = 0.45;
      ctx.font = "12px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.fillText("Sem dados", width / 2, height / 2);
      ctx.globalAlpha = 1;
      return;
    }

    const max = array.reduce((current, value) => Math.max(current, value), 1);
    const paddingTop = array.length <= 30 ? 18 : 6;
    const usableHeight = height - paddingTop;
    const layout = getLayout(array.length, width);
    const { aggregated, bucketCount, barWidth, gap } = layout;

    for (let bucket = 0; bucket < bucketCount; bucket++) {
      const [start, end] = bucketRange(bucket, bucketCount, array.length);
      let sum = 0;
      let min = Number.POSITIVE_INFINITY;
      let maxValue = 0;

      for (let index = start; index <= end; index++) {
        const value = array[index];
        sum += value;
        if (value < min) min = value;
        if (value > maxValue) maxValue = value;
      }

      const average = sum / (end - start + 1);
      const barHeight = Math.max(1, (average / max) * usableHeight);
      const minHeight = Math.max(1, (min / max) * usableHeight);
      const maxHeight = Math.max(1, (maxValue / max) * usableHeight);
      const x = bucket * (barWidth + gap);
      const y = height - barHeight;

      let color = colors.primary;
      let alpha = 0.82;

      if (finished) {
        color = colors.success;
        alpha = 0.9;
      } else {
        if (found !== null && found !== undefined && containsRange(bucket, bucketCount, array.length, found)) {
          color = colors.success;
          alpha = 1;
        }
        if (write !== null && write !== undefined && containsRange(bucket, bucketCount, array.length, write)) {
          color = colors.info;
          alpha = 1;
        }
        if (
          swap &&
          (containsRange(bucket, bucketCount, array.length, swap[0]) ||
            containsRange(bucket, bucketCount, array.length, swap[1]))
        ) {
          color = colors.error;
          alpha = 1;
        }
        if (
          compare &&
          (containsRange(bucket, bucketCount, array.length, compare[0]) ||
            containsRange(bucket, bucketCount, array.length, compare[1]))
        ) {
          color = colors.warning;
          alpha = 1;
        }
        if (
          range &&
          (end < range[0] || start > range[1])
        ) {
          alpha = 0.2;
        }
      }

      ctx.globalAlpha = alpha * 0.35;
      ctx.fillStyle = color;
      if (aggregated && maxHeight > minHeight) {
        ctx.fillRect(
          x,
          height - maxHeight,
          Math.max(1, barWidth),
          maxHeight - minHeight,
        );
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, Math.max(1, barWidth), barHeight);

      if (!aggregated && array.length <= 30) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.text;
        ctx.font = "10px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(array[bucket]), x + barWidth / 2, y - 4);
      }
    }

    if (hover) {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = colors.text;
      ctx.fillRect(Math.max(0, hover.x - 0.5), 0, 1, height);
      ctx.globalAlpha = 1;
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.line;
    ctx.fillRect(0, height - 1, width, 1);
  }, [array, compare, swap, write, found, range, finished, hover]);

  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => drawRef.current());
    observer.observe(container);
    drawRef.current();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || array.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const x = Math.min(width, Math.max(0, event.clientX - rect.left));
    const layout = getLayout(array.length, width);
    const bucket = Math.min(
      layout.bucketCount - 1,
      Math.floor(x / (layout.barWidth + layout.gap)),
    );
    const [start, end] = bucketRange(
      bucket,
      layout.bucketCount,
      array.length,
    );

    let label: string;
    if (start === end) {
      label = `[${fullNumber.format(start)}]  ${fullNumber.format(array[start])}`;
    } else {
      let sum = 0;
      let min = Number.POSITIVE_INFINITY;
      let max = 0;
      for (let index = start; index <= end; index++) {
        sum += array[index];
        if (array[index] < min) min = array[index];
        if (array[index] > max) max = array[index];
      }
      const average = sum / (end - start + 1);
      label = `[${fullNumber.format(start)}–${fullNumber.format(end)}]  média ${fullNumber.format(Math.round(average))}  ·  ${fullNumber.format(min)}–${fullNumber.format(max)}`;
    }

    setHover({ x, bucket, label });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-72 w-full border border-base-300 bg-base-100 md:h-96"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label={`Vetor com ${fullNumber.format(array.length)} elementos`}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHover(null)}
      />
      {hover && (
        <div
          className="pointer-events-none absolute top-2 z-10 max-w-[calc(100%-1rem)] -translate-x-1/2 border border-base-300 bg-base-100 px-2 py-1 font-mono text-[11px] text-base-content shadow-sm"
          style={{ left: hover.x }}
        >
          {hover.label}
        </div>
      )}
    </div>
  );
}
