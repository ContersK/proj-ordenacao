"use client";
import { useSortingStore } from "@/modules/sorting/index";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function VisualizadorPage() {
  //constantes para armazenar as propriedades do store
  const currentArray = useSortingStore((state) => state.currentArray);
  const generate = useSortingStore((state) => state.generate);
  const setSize = useSortingStore((state) => state.setSize);

  //constantes para armazenar o tamanho do array e manipular o erro
  const [size, setSizeInput] = useState(50);
  const [erro, setErro] = useState("");

  const handleGerar = () => {
    if (size < 2 || size > 300) {
      setErro("O tamanho do array deve ser entre 2 e 300");
      return;
    }
    setErro("");
    setSize(size);
    generate();
  };

  return (
    <div>
      <input
        type="number"
        placeholder="tamanho do array"
        value={size}
        onChange={(e) => setSizeInput(parseInt(e.target.value) || 0)}
      ></input>
      <br></br>
      <Button onClick={handleGerar}>Gerar array</Button>
      {erro && (
        <div role="alert" className="alert alert-error">
          <AlertCircleIcon size={16} />
          <p>{erro}</p>
        </div>
      )}

      <p>quantidade de elementos do array: {currentArray.length}</p>
      <div className="flex items-end gap-1 h-64 bg-base-200 rounded p-2 overflow-hidden">
        {currentArray.map((item, index) => (
          <div
            key={index}
            title={String(item)}
            style={{ height: `${(item / 500) * 100}%` }}
            className="flex-1 rounded-t bg-linear-to-t from-primary to-secondary transition-all duration-300"
          />
        ))}
      </div>
      <Link href="/">Voltar</Link>
    </div>
  );
}
