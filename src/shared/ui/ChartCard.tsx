"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartRow = Record<string, string | number>;

const fullNumber = new Intl.NumberFormat("pt-BR");
const compactNumber = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type Series = {
  key: string;
  label: string;
  color: string;
};

type ChartCardProps = {
  title: string;
  description?: string;
  data: ChartRow[];
  xKey: string;
  series: Series[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  action?: ReactNode;
  children?: ReactNode;
};

export function ChartCard({
  title,
  description,
  data,
  xKey,
  series,
  xLabel,
  yLabel,
  height = 320,
  action,
  children,
}: ChartCardProps) {
  return (
    <section className="border border-base-300 bg-base-100">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-base-300 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-base-content/55">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>

      <div className="p-4">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-base-300)"
              />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) =>
                  typeof value === "number"
                    ? fullNumber.format(value)
                    : String(value)
                }
                label={
                  xLabel
                    ? {
                        value: xLabel,
                        position: "insideBottom",
                        offset: -4,
                        fontSize: 11,
                      }
                    : undefined
                }
              />
              <YAxis
                tick={{ fontSize: 11 }}
                width={64}
                tickFormatter={(value) =>
                  typeof value === "number"
                    ? compactNumber.format(value)
                    : String(value)
                }
                label={
                  yLabel
                    ? {
                        value: yLabel,
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 11,
                      }
                    : undefined
                }
              />
              <Tooltip
                labelFormatter={(value) =>
                  `${xLabel ?? "n"} = ${fullNumber.format(Number(value))}`
                }
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  borderColor: "var(--color-base-300)",
                  background: "var(--color-base-100)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {series.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {children}
      </div>
    </section>
  );
}
