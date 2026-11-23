const intFormatter = new Intl.NumberFormat("pt-BR");

export function formatInt(value: number): string {
  return intFormatter.format(value);
}

export function formatMs(value: number): string {
  return value < 1
    ? `${value.toFixed(3)} ms`
    : `${value.toFixed(2)} ms`;
}

export function formatIndex(value: number): string {
  return value < 0 ? "não encontrado" : String(value);
}
