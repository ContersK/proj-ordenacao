import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  CircleCheck,
  Clock,
  PenLine,
  Repeat,
  Search,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { SearchMetrics, SortMetrics } from "@/modules/algorithms/types";
import {
  formatIndex,
  formatInt,
  formatMs,
} from "@/modules/algorithms/utils/format";

type MetricsGridProps =
  | { mode: "sorting"; metrics: SortMetrics; finished: boolean }
  | { mode: "search"; metrics: SearchMetrics; keyValue: number };

function MetricCell({ children }: { children: ReactNode }) {
  return <div className="bg-base-100">{children}</div>;
}

export function MetricsGrid(props: MetricsGridProps) {
  if (props.mode === "sorting") {
    const { metrics, finished } = props;

    return (
      <div className="grid grid-cols-2 gap-px bg-base-300 sm:grid-cols-3 xl:grid-cols-5">
        <MetricCell>
          <StatCard
            label="Comparações"
            value={formatInt(metrics.comparisons)}
            icon={<ArrowLeftRight size={12} />}
          />
        </MetricCell>
        <MetricCell>
          <StatCard
            label="Trocas"
            value={formatInt(metrics.swaps)}
            icon={<Repeat size={12} />}
          />
        </MetricCell>
        <MetricCell>
          <StatCard
            label="Escritas"
            value={formatInt(metrics.writes)}
            icon={<PenLine size={12} />}
          />
        </MetricCell>
        <MetricCell>
          <StatCard
            label="Chamadas recursivas"
            value={formatInt(metrics.recursiveCalls)}
            icon={<Repeat size={12} />}
          />
        </MetricCell>
        <MetricCell>
          <StatCard
            label={finished ? "Tempo final" : "Tempo"}
            value={formatMs(metrics.timeMs)}
            icon={<Clock size={12} />}
          />
        </MetricCell>
      </div>
    );
  }

  const { metrics, keyValue } = props;

  return (
    <div className="grid grid-cols-2 gap-px bg-base-300 sm:grid-cols-3 xl:grid-cols-5">
      <MetricCell>
        <StatCard
          label="Comparações"
          value={formatInt(metrics.comparisons)}
          icon={<Search size={12} />}
        />
      </MetricCell>
      <MetricCell>
        <StatCard
          label="Tamanho"
          value={formatInt(metrics.size)}
          icon={<ArrowLeftRight size={12} />}
        />
      </MetricCell>
      <MetricCell>
        <StatCard
          label="Chave"
          value={formatInt(keyValue)}
          icon={<Search size={12} />}
        />
      </MetricCell>
      <MetricCell>
        <StatCard
          label="Índice"
          value={formatIndex(metrics.foundIndex)}
          icon={<CircleCheck size={12} />}
        />
      </MetricCell>
      <MetricCell>
        <StatCard
          label="Tempo"
          value={formatMs(metrics.timeMs)}
          icon={<Clock size={12} />}
        />
      </MetricCell>
    </div>
  );
}
