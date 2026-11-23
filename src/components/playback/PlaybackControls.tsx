"use client";

import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";

type PlaybackControlsProps = {
  playing: boolean;
  index: number;
  total: number;
  speedMs: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
};

const speedOptions = [
  { value: 100, label: "0,5×" },
  { value: 40, label: "1×" },
  { value: 12, label: "2×" },
  { value: 2, label: "4×" },
];

const fullNumber = new Intl.NumberFormat("pt-BR");

export function PlaybackControls({
  playing,
  index,
  total,
  speedMs,
  onToggle,
  onPrev,
  onNext,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const canPlay = total > 0;
  const current = index + 1;

  return (
    <div className="flex flex-col gap-2.5 border-t border-base-300 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm min-h-10"
          onClick={onToggle}
          disabled={!canPlay}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? "Pausar" : "Reproduzir"}
        </button>

        <div className="join">
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-10"
            onClick={onPrev}
            disabled={!canPlay || index < 0}
            title="Passo anterior"
            aria-label="Passo anterior"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-10"
            onClick={onNext}
            disabled={!canPlay || index >= total - 1}
            title="Próximo passo"
            aria-label="Próximo passo"
          >
            <SkipForward size={16} />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm join-item min-h-10"
            onClick={onReset}
            disabled={!canPlay || index < 0}
            title="Reiniciar"
            aria-label="Reiniciar"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-base-content/55">Velocidade</span>
          <div
            className="join"
            role="group"
            aria-label="Velocidade da animação"
          >
            {speedOptions.map((option) => {
              const active = speedMs === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`btn btn-sm join-item min-h-9 px-2 font-mono text-xs ${
                    active ? "btn-neutral" : "btn-ghost"
                  }`}
                  aria-pressed={active}
                  onClick={() => onSpeedChange(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <progress
          className="progress progress-primary h-1.5 w-full"
          value={Math.max(0, current)}
          max={Math.max(1, total)}
          aria-label="Progresso da animação"
        />
        <span className="whitespace-nowrap font-mono text-xs text-base-content/55">
          {canPlay ? `${fullNumber.format(Math.max(1, current))}/${fullNumber.format(total)}` : "0/0"}
        </span>
      </div>
    </div>
  );
}
