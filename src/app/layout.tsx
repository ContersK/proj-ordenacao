import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import Header from "@/shared/ui/Header";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Análise de Algoritmos",
    template: "%s | Análise de Algoritmos",
  },
  description:
    "Visualização, comparação e análise de algoritmos de ordenação e busca.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
      data-theme="lab"
    >
      <body className="flex min-h-screen flex-col bg-base-200 font-sans text-base-content">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
