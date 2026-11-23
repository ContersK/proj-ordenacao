"use client";

import { useState } from "react";
import { SearchBenchmarkPanel } from "@/components/benchmark/SearchBenchmarkPanel";
import { SortingBenchmarkPanel } from "@/components/benchmark/SortingBenchmarkPanel";
import { PageHeader } from "@/components/ui/PageHeader";

type Tab = "sorting" | "search";

export default function CompararPage() {
  const [tab, setTab] = useState<Tab>("sorting");

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Comparar algoritmos"
        description="Execute benchmarks, compare tempo e operações e exporte os resultados."
      />

      <div role="tablist" className="join w-fit">
        <button
          id="tab-sorting"
          type="button"
          role="tab"
          aria-selected={tab === "sorting"}
          aria-controls="panel-sorting"
          className={`btn btn-sm join-item min-h-9 ${
            tab === "sorting" ? "btn-neutral" : "btn-ghost"
          }`}
          onClick={() => setTab("sorting")}
        >
          Ordenação
        </button>
        <button
          id="tab-search"
          type="button"
          role="tab"
          aria-selected={tab === "search"}
          aria-controls="panel-search"
          className={`btn btn-sm join-item min-h-9 ${
            tab === "search" ? "btn-neutral" : "btn-ghost"
          }`}
          onClick={() => setTab("search")}
        >
          Busca
        </button>
      </div>

      <div
        id="panel-sorting"
        role="tabpanel"
        aria-labelledby="tab-sorting"
        className={tab === "sorting" ? "block" : "hidden"}
      >
        <SortingBenchmarkPanel />
      </div>

      <div
        id="panel-search"
        role="tabpanel"
        aria-labelledby="tab-search"
        className={tab === "search" ? "block" : "hidden"}
      >
        <SearchBenchmarkPanel />
      </div>
    </div>
  );
}
