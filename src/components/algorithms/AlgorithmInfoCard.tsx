import { ChevronDown } from "lucide-react";
import type {
  SearchAlgorithm,
  SortingAlgorithm,
} from "@/modules/algorithms/types";

type AlgorithmInfoCardProps = {
  algorithm: SortingAlgorithm | SearchAlgorithm;
};

export function AlgorithmInfoCard({ algorithm }: AlgorithmInfoCardProps) {
  const isSorting = "stable" in algorithm;

  return (
    <details className="group border border-base-300 bg-base-100">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span>Sobre {algorithm.name}</span>
        <ChevronDown
          size={16}
          className="text-base-content/45 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="space-y-4 border-t border-base-300 p-4">
        <p className="max-w-3xl text-sm leading-relaxed text-base-content/65">
          {algorithm.description}
        </p>

        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-base-content/55">Melhor caso</dt>
            <dd className="font-mono font-medium">
              {algorithm.complexities.best}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-base-content/55">Caso médio</dt>
            <dd className="font-mono font-medium">
              {algorithm.complexities.average}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-base-content/55">Pior caso</dt>
            <dd className="font-mono font-medium">
              {algorithm.complexities.worst}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-base-content/55">Espaço</dt>
            <dd className="font-mono font-medium">
              {algorithm.complexities.space}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-2">
          <span className="badge badge-ghost">
            {algorithm.dominantOperation}
          </span>

          {isSorting ? (
            <>
              <span
                className={`badge ${algorithm.stable ? "badge-success" : "badge-warning"}`}
              >
                {algorithm.stable ? "Estável" : "Não estável"}
              </span>
              <span className="badge badge-ghost">
                {algorithm.inPlace ? "In-place" : "Fora do lugar"}
              </span>
            </>
          ) : (
            <span
              className={`badge ${algorithm.requiresSorted ? "badge-warning" : "badge-success"}`}
            >
              {algorithm.requiresSorted
                ? "Exige vetor ordenado"
                : "Aceita qualquer vetor"}
            </span>
          )}
        </div>

        <p className="text-xs text-base-content/55">
          {isSorting ? "Recorrência: " : "Função de custo: "}
          <span className="font-mono text-base-content/80">
            {isSorting ? algorithm.recurrence : algorithm.cost}
          </span>
        </p>
      </div>
    </details>
  );
}
