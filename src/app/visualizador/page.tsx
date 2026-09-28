"use client";
import { useSortingStore } from "@/modules/sorting/index";
import { useState } from "react";

export default function VisualizadorPage() {
  const currentArray = useSortingStore((state) => state.currentArray);
  const generate = useSortingStore((state) => state.generate);
  const setSize = useSortingStore((state) => state.setSize);

  const [size, setSizeInput] = useState(50);
  const handleGerar = () => {
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
      ></input>{" "}
      <br></br>
      <button onClick={handleGerar}>Gerar array</button>
      <p>quantidade de elementos do array: {currentArray.length}</p>
      <p>
        elementos do array: <br />
        {currentArray.map((item, index) => (
          <span key={index}> {item} </span>
        ))}
      </p>
    </div>
  );
}
