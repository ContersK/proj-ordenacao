"use client";

import { useMemo, useState } from "react";
import { ChartColumn, Shuffle } from "lucide-react";
import { AlgorithmInfoCard } from "@/components/algorithms/AlgorithmInfoCard";
import { MetricsGrid } from "@/components/algorithms/MetricsGrid";
import { PlaybackControls } from "@/components/playback/PlaybackControls";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrayBars } from "@/components/visualization/ArrayBars";
import { StepLegend } from "@/components/visualization/StepLegend";
import { useSortPlayback } from "@/hooks/useSortPlayback";
import {
  formatInt,
  inputFormats,
  sortingAlgorithms,
  sortingList,
  useSortingStore,
} from "@/modules/algorithms";
import type {
  AlgorithmId,
  InputFormat,
  SortResult,
  SortStep,
} from "@/modules/algorithms";

const EMPTY_STEPS: SortStep[] = [];
const RECORDING_BUDGET = 2_000_000;

function estimateSteps(algorithmId: AlgorithmId, size: number): number {
  if (algorithmId === "merge" || algorithmId === "heap") {
    return size * Math.log2(Math.max(2, size)) * 4;
  }

  return size * size;
}

export default function SortingVisualizer() {
  const inputFormat = useSortingStore((state) => state.inputFormat);
  const setSize = useSortingStore((state) => state.setSize);
  const generate = useSortingStore((state) => state.generate);

  const [sizeInput, setSizeInput] = useState(
    () => useSortingStore.getState().currentArray.length,
  );
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>("quick");
  const [inputArray, setInputArray] = useState<number[]>(
    () => useSortingStore.getState().currentArray,
  );
  const [result, setResult] = useState<SortResult | null>(null);
  const [speedMs, setSpeedMs] = useState(40);
  const [error, setError] = useState("");

  const steps = result ? result.steps : EMPTY_STEPS;
  const playback = useSortPlayback(inputArray, steps, speedMs);

  const currentStep = playback.index >= 0 ? steps[playback.index] : null;

  const compare = useMemo<[number, number] | null>(
    () =>
      currentStep?.type === "compare"
        ? [currentStep.i, currentStep.j]
        : null,
    [currentStep],
  );

  const swap = useMemo<[number, number] | null>(
    () =>
      currentStep?.type === "swap"
        ? [currentStep.i, currentStep.j]
        : null,
    [currentStep],
  );

  const write =
    currentStep?.type === "write" ? currentStep.index : null;

  const atEnd = result !== null && playback.index >= steps.length - 1;
  const finished = atEnd;
  const displayArray =
    result && atEnd
      ? result.array
      : result
        ? playback.array
        : inputArray;

  const handleGenerate = () => {
    if (!Number.isInteger(sizeInput) || sizeInput < 1) {
      setError("Informe um inteiro positivo para o tamanho do vetor.");
      return;
    }

    setError("");
    setResult(null);
    setSize(sizeInput);
    generate();
    const next = useSortingStore.getState().currentArray;
    setInputArray(next);
    playback.load(next, EMPTY_STEPS);
  };

  const handleRun = () => {
    if (inputArray.length === 0) return;

    const recordSteps =
      estimateSteps(algorithmId, inputArray.length) <= RECORDING_BUDGET;
    const next = sortingAlgorithms[algorithmId].run(inputArray, {
      recordSteps,
    });

    setResult(next);
    playback.load(inputArray, next.steps);
  };

  const handleAlgorithmChange = (value: AlgorithmId) => {
    setAlgorithmId(value);
    setResult(null);
    playback.load(inputArray, EMPTY_STEPS);
  };

  const handleFormatChange = (value: InputFormat) => {
    const state = useSortingStore.getState();
    const size =
      Number.isInteger(sizeInput) && sizeInput > 0
        ? sizeInput
        : state.currentArray.length;

    state.setInputFormat(value);
    state.setSize(size);
    state.generate();
    const next = useSortingStore.getState().currentArray;

    setSizeInput(size);
    setInputArray(next);
    setResult(null);
    setError("");
    playback.load(next, EMPTY_STEPS);
  };

  const formatLabel =
    inputFormats.find((item) => item.id === inputFormat)?.label ?? "";
  const hasAnimation = result !== null && steps.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Visualizar ordenação"
        description="Gere um vetor, escolha um algoritmo e acompanhe cada comparação, troca e escrita."
      />

      <section className="border border-base-300 bg-base-100">
        <div className="grid gap-3 p-4 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
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
            Formato do vetor
            <select
              className="select select-bordered w-full"
              value={inputFormat}
              onChange={(event) =>
                handleFormatChange(event.target.value as InputFormat)
              }
            >
              {inputFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium">
            Algoritmo
            <select
              className="select select-bordered w-full"
              value={algorithmId}
              onChange={(event) =>
                handleAlgorithmChange(event.target.value as AlgorithmId)
              }
            >
              {sortingList.map((algorithm) => (
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
            disabled={inputArray.length === 0}
          >
            <ChartColumn size={16} />
            Executar {sortingAlgorithms[algorithmId].name}
          </button>

          <p className="font-mono text-xs text-base-content/55">
            {formatInt(displayArray.length)} elementos · {formatLabel}
            {result ? ` · ${formatInt(result.steps.length)} passos` : ""}
          </p>
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
              Passe o cursor sobre as barras para inspecionar posições e valores.
            </p>
          </div>
          <StepLegend mode="sorting" />
        </div>

        <div className="p-4">
          <ArrayBars
            array={displayArray}
            compare={finished ? null : compare}
            swap={finished ? null : swap}
            write={finished ? null : write}
            finished={finished}
          />

          {hasAnimation ? (
            <PlaybackControls
              playing={playback.playing}
              index={playback.index}
              total={steps.length}
              speedMs={speedMs}
              onToggle={playback.toggle}
              onPrev={playback.prev}
              onNext={playback.next}
              onReset={playback.reset}
              onSpeedChange={setSpeedMs}
            />
          ) : result ? (
            <p className="border-t border-base-300 pt-3 font-mono text-xs text-base-content/55">
              Resultado final.
            </p>
          ) : (
            <p className="border-t border-base-300 pt-3 text-xs text-base-content/55">
              Execute um algoritmo para acompanhar a animação.
            </p>
          )}
        </div>
      </section>

      {result && (
        <div className="border border-base-300 bg-base-100">
          <MetricsGrid
            mode="sorting"
            metrics={result.metrics}
            finished={finished}
          />
        </div>
      )}

      <AlgorithmInfoCard algorithm={sortingAlgorithms[algorithmId]} />
    </div>
  );
}
