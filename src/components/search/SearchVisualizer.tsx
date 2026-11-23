"use client";

import { useMemo, useState } from "react";
import { Search, Shuffle } from "lucide-react";
import { AlgorithmInfoCard } from "@/components/algorithms/AlgorithmInfoCard";
import { MetricsGrid } from "@/components/algorithms/MetricsGrid";
import { PlaybackControls } from "@/components/playback/PlaybackControls";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrayBars } from "@/components/visualization/ArrayBars";
import { StepLegend } from "@/components/visualization/StepLegend";
import { useStepPlayer } from "@/hooks/useStepPlayer";
import {
  formatInt,
  generateSearchArray,
  keyForPosition,
  keyPositions,
  searchAlgorithms,
  searchList,
} from "@/modules/algorithms";
import type {
  KeyPosition,
  SearchAlgorithmId,
  SearchResult,
  SearchStep,
} from "@/modules/algorithms";

const EMPTY_STEPS: SearchStep[] = [];
const RECORDING_BUDGET = 2_000_000;

export default function SearchVisualizer() {
  const [sizeInput, setSizeInput] = useState(50);
  const [position, setPosition] = useState<KeyPosition>("middle");
  const [algorithmId, setAlgorithmId] =
    useState<SearchAlgorithmId>("sequential");
  const [array, setArray] = useState<number[]>(() => generateSearchArray(50));
  const [key, setKey] = useState(() =>
    keyForPosition(generateSearchArray(50), "middle"),
  );
  const [result, setResult] = useState<SearchResult | null>(null);
  const [speedMs, setSpeedMs] = useState(40);
  const [error, setError] = useState("");

  const steps = result ? result.steps : EMPTY_STEPS;
  const player = useStepPlayer(steps.length, speedMs);

  const currentStep = player.index >= 0 ? steps[player.index] : null;
  const hasAnimation = result !== null && steps.length > 0;

  const compare = useMemo<[number, number] | null>(
    () =>
      currentStep?.type === "compare"
        ? [currentStep.index, currentStep.index]
        : null,
    [currentStep],
  );

  const range = useMemo<[number, number] | null>(
    () =>
      currentStep?.type === "compare" &&
      currentStep.low !== undefined &&
      currentStep.high !== undefined
        ? [currentStep.low, currentStep.high]
        : null,
    [currentStep],
  );

  const found = hasAnimation
    ? currentStep?.type === "found"
      ? currentStep.index
      : null
    : result && result.metrics.foundIndex >= 0
      ? result.metrics.foundIndex
      : null;

  const handleGenerate = () => {
    if (!Number.isInteger(sizeInput) || sizeInput < 1) {
      setError("Informe um inteiro positivo para o tamanho do vetor.");
      return;
    }

    setError("");
    const next = generateSearchArray(sizeInput);
    setArray(next);
    setKey(keyForPosition(next, position));
    setResult(null);
    player.reset();
  };

  const handleRun = () => {
    const recordSteps = array.length <= RECORDING_BUDGET;
    const next = searchAlgorithms[algorithmId].run(array, key, {
      recordSteps,
    });
    setResult(next);
    player.load(next.steps.length);
  };

  const handlePositionChange = (value: KeyPosition) => {
    setPosition(value);
    setKey(keyForPosition(array, value));
    setResult(null);
    player.reset();
  };

  const handleAlgorithmChange = (value: SearchAlgorithmId) => {
    setAlgorithmId(value);
    setResult(null);
    player.reset();
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Visualizar busca"
        description="Compare a busca sequencial com a binária e veja o intervalo de busca diminuir."
      />

      <section className="border border-base-300 bg-base-100">
        <div className="grid gap-3 p-4 md:grid-cols-[7rem_minmax(0,1fr)_7rem_minmax(0,1fr)_auto] md:items-end">
          <label className="flex flex-col gap-1 text-xs font-medium">
            Tamanho
            <input
              type="number"
              min={1}
              value={sizeInput}
              onChange={(event) =>
                setSizeInput(Number(event.target.value) || 0)
              }
              className="input input-bordered w-full"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium">
            Posição da chave
            <select
              className="select select-bordered w-full"
              value={position}
              onChange={(event) =>
                handlePositionChange(event.target.value as KeyPosition)
              }
            >
              {keyPositions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium">
            Chave
            <input
              type="number"
              value={key}
              onChange={(event) => {
                setKey(Number(event.target.value) || 0);
                setResult(null);
                player.reset();
              }}
              className="input input-bordered w-full font-mono"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium">
            Algoritmo
            <select
              className="select select-bordered w-full"
              value={algorithmId}
              onChange={(event) =>
                handleAlgorithmChange(
                  event.target.value as SearchAlgorithmId,
                )
              }
            >
              {searchList.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="btn btn-outline min-h-10"
            onClick={handleGenerate}
          >
            <Shuffle size={16} />
            Gerar vetor
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-base-300 px-4 py-3">
          <button
            type="button"
            className="btn btn-primary min-h-10"
            onClick={handleRun}
            disabled={array.length === 0}
          >
            <Search size={16} />
            Executar {searchAlgorithms[algorithmId].name}
          </button>

          <p className="font-mono text-xs text-base-content/55">
            {formatInt(array.length)} elementos · chave {formatInt(key)}
            {result ? ` · ${formatInt(result.steps.length)} passos` : ""}
          </p>

          {result && (
            <span
              className={`ml-auto font-mono text-xs ${
                result.metrics.foundIndex >= 0
                  ? "text-success"
                  : "text-warning"
              }`}
            >
              {result.metrics.foundIndex >= 0
                ? `índice ${formatInt(result.metrics.foundIndex)}`
                : "não encontrada"}
            </span>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="border-t border-error/30 bg-error/5 px-4 py-2 text-xs text-error"
          >
            {error}
          </p>
        )}
      </section>

      <section className="border border-base-300 bg-base-100">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Vetor</h2>
            <p className="mt-0.5 text-xs text-base-content/55">
              O vetor é crescente para que a busca binária seja válida.
            </p>
          </div>
          <StepLegend mode="search" />
        </div>

        <div className="p-4">
          <ArrayBars
            array={array}
            compare={compare}
            found={found}
            range={range}
          />

          {hasAnimation ? (
            <PlaybackControls
              playing={player.playing}
              index={player.index}
              total={steps.length}
              speedMs={speedMs}
              onToggle={player.toggle}
              onPrev={player.prev}
              onNext={player.next}
              onReset={player.reset}
              onSpeedChange={setSpeedMs}
            />
          ) : result ? (
            <p className="border-t border-base-300 pt-3 font-mono text-xs text-base-content/55">
              Resultado final.
            </p>
          ) : (
            <p className="border-t border-base-300 pt-3 text-xs text-base-content/55">
              Execute uma busca para acompanhar a animação.
            </p>
          )}
        </div>
      </section>

      {result && (
        <div className="border border-base-300 bg-base-100">
          <MetricsGrid mode="search" metrics={result.metrics} keyValue={key} />
        </div>
      )}

      <AlgorithmInfoCard algorithm={searchAlgorithms[algorithmId]} />
    </div>
  );
}
