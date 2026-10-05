"use client";
import { useSortingStore } from "@/modules/sorting/index";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {ChartColumn} from '@gravity-ui/icons';

export default function VisualizadorPage() {
  //constantes para armazenar as propriedades do store
  const currentArray = useSortingStore((state) => state.currentArray);
  const generate = useSortingStore((state) => state.generate);
  const setSize = useSortingStore((state) => state.setSize);
  const maxSize = useSortingStore((state) => state.vectorConfig.maxSize);
  const maxValue = useSortingStore((state) => state.vectorConfig.maxValue);

  //constantes para armazenar o tamanho do array e manipular o erro
  const [size, setSizeInput] = useState(50);
  const [erro, setErro] = useState("");

  const handleGerar = () => {
    if (size < 50 || size > maxSize) {
      setErro(`O tamanho do array deve ser entre 2 e ${maxSize}`);
      return;
    }
    setErro("");
    setSize(size);
    generate();
  };

  // Escala normalizada pelo maxValue real do store (evita barras > 100% cortadas no topo)
  const maxScale = maxValue > 0 ? maxValue : 1;
  // Gap menor quando há muitas barras, para todas caberem sem sumir
  const barGap =
    currentArray.length > 150
      ? "gap-px"
      : currentArray.length > 80
        ? "gap-[2px]"
        : "gap-1";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-sm">
          Tamanho do array (50–{maxSize})
          <input
            type="number"
            min={2}
            max={maxSize}
            placeholder="tamanho do array"
            value={size}
            onChange={(e) => setSizeInput(parseInt(e.target.value) || 0)}
            className="input input-bordered w-40"
          />
        </label>
        <Button variant="secondary" onPress={handleGerar}>
          <ChartColumn/>Gerar array</Button>
      </div>
      {erro && (
        <div role="alert" className="alert alert-error">
          <AlertCircleIcon size={16} />
          <p>{erro}</p>
        </div>
      )}

      <p>quantidade de elementos do array: {currentArray.length}</p>
      <div className="bg-base-200 rounded p-2 overflow-x-auto overflow-y-hidden">
        <div
          className={`flex items-end h-64 md:h-80 min-w-full ${barGap}`}
        >
          {currentArray.map((item, index) => (
            <div
              key={index}
              title={String(item)}
              style={{
                height: `${Math.min(100, (item / maxScale) * 100)}%`,
              }}
              className="flex-1 min-w-[2px] min-h-[2px] rounded-t bg-linear-to-t from-primary to-secondary transition-all duration-300"
            />
          ))}
        </div>
      </div>
      <Link href="/">Voltar</Link>
    </div>
  );
}
