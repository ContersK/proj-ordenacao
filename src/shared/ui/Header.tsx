"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/visualizar", label: "Visualizar" },
  { href: "/buscar", label: "Buscar" },
  { href: "/comparar", label: "Comparar" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
          aria-label="Análise de Algoritmos, página inicial"
        >
          <span className="flex h-8 w-8 shrink-0 items-end gap-0.5 border border-base-content/20 bg-base-200 p-1.5">
            <span className="h-2 w-1 bg-primary" />
            <span className="h-3.5 w-1 bg-primary" />
            <span className="h-2.5 w-1 bg-secondary" />
            <span className="h-4 w-1 bg-primary" />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">
            Análise de Algoritmos
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="flex items-center gap-0.5 overflow-x-auto"
        >
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-base-200 font-medium text-base-content"
                    : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
