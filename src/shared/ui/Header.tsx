import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-base-100 flex justify-between items-center p-4 shadow">
      <p className="font-bold align-">Analise de Algoritmos de ordenação</p>
      <section className="flex gap-2">
        <Link href="/visualizar" className="btn btn-primary">
          Visualizar
        </Link>
        <Link href="/comparar" className="btn btn-primary">
          comparar
        </Link>
        <Link href="/" className="btn btn-primary">
          Home
        </Link>
      </section>
    </header>
  );
}
