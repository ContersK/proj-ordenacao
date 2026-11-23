import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { searchList, sortingList } from "@/modules/algorithms";

const previewValues = Array.from(
  { length: 40 },
  (_, index) => 16 + ((index * 37 + 11) % 82),
);

const paths = [
  {
    href: "/visualizar",
    title: "Visualizar",
    description:
      "Acompanhe comparações, trocas e escritas de seis algoritmos de ordenação.",
  },
  {
    href: "/buscar",
    title: "Buscar",
    description:
      "Compare a busca sequencial com a binária e veja o intervalo diminuir.",
  },
  {
    href: "/comparar",
    title: "Comparar",
    description:
      "Meça tempo e operações, leia os gráficos e exporte os resultados.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 border-b border-base-300 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-xl">
          <p className="font-mono text-xs text-base-content/55">
            Projeto de Análise de Algoritmos
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Ordenação e busca, passo a passo.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-base-content/70">
            Visualize algoritmos, meça operações e compare o crescimento com o
            tamanho da entrada.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link href="/visualizar" className="btn btn-primary">
              Abrir visualizador
            </Link>
            <Link href="/comparar" className="btn btn-outline">
              Comparar benchmarks
            </Link>
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-base-content/55">Ordenações</dt>
              <dd className="font-mono font-medium">6</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-base-content/55">Buscas</dt>
              <dd className="font-mono font-medium">2</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-base-content/55">Formatos</dt>
              <dd className="font-mono font-medium">5</dd>
            </div>
          </dl>
        </div>

        <div
          className="lab-grid relative border border-base-300 bg-base-100 p-4"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between border-b border-base-300 pb-3 font-mono text-[11px] text-base-content/55">
            <span>vetor de entrada</span>
            <span>n = {previewValues.length}</span>
          </div>
          <div className="flex h-48 items-end gap-[2px] pt-6 md:h-56">
            {previewValues.map((value, index) => {
              const comparing = index === 17 || index === 18;
              const swapping = index === 28 || index === 29;

              return (
                <span
                  key={index}
                  className={`min-w-0 flex-1 ${
                    swapping
                      ? "bg-error"
                      : comparing
                        ? "bg-warning"
                        : "bg-primary/80"
                  }`}
                  style={{ height: `${value}%` }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3 font-mono text-[11px] text-base-content/55">
            <span>0</span>
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 bg-warning" />
                comparação
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 bg-error" />
                troca
              </span>
            </span>
            <span>{previewValues.length - 1}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {paths.map((path) => (
          <Link
            key={path.href}
            href={path.href}
            className="group flex min-h-44 flex-col justify-between border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary"
          >
            <div>
              <div className="flex justify-end">
                <ArrowUpRight
                  size={18}
                  className="text-base-content/35 transition-colors group-hover:text-primary"
                />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                {path.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-base-content/65">
                {path.description}
              </p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-baseline justify-between gap-3 border-b border-base-300 pb-3">
            <h2 className="text-lg font-semibold tracking-tight">Ordenação</h2>
            <Link
              href="/visualizar"
              className="text-sm text-primary hover:underline"
            >
              Abrir
            </Link>
          </div>
          <div className="divide-y divide-base-300">
            {sortingList.map((algorithm) => (
              <div
                key={algorithm.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{algorithm.name}</p>
                  <p className="truncate text-xs text-base-content/55">
                    {algorithm.dominantOperation}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5 font-mono text-xs">
                  <span className="border border-base-300 px-1.5 py-0.5">
                    {algorithm.complexities.best}
                  </span>
                  <span className="border border-base-300 px-1.5 py-0.5">
                    {algorithm.complexities.worst}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3 border-b border-base-300 pb-3">
            <h2 className="text-lg font-semibold tracking-tight">Busca</h2>
            <Link
              href="/buscar"
              className="text-sm text-primary hover:underline"
            >
              Abrir
            </Link>
          </div>
          <div className="divide-y divide-base-300">
            {searchList.map((algorithm) => (
              <div
                key={algorithm.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{algorithm.name}</p>
                  <p className="truncate text-xs text-base-content/55">
                    {algorithm.dominantOperation}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5 font-mono text-xs">
                  <span className="border border-base-300 px-1.5 py-0.5">
                    {algorithm.complexities.best}
                  </span>
                  <span className="border border-base-300 px-1.5 py-0.5">
                    {algorithm.complexities.worst}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
