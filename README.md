# Análise de Algoritmos

Sistema web interativo para visualizar, comparar e analisar algoritmos de ordenação e busca.

## Funcionalidades

- Visualização de 6 algoritmos de ordenação: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort e Heap Sort.
- Visualização de 2 algoritmos de busca: Busca Sequencial e Busca Binária.
- Controle de reprodução com passos, velocidade e progresso.
- Métricas de comparações, trocas, escritas, chamadas recursivas, tamanho da entrada e tempo.
- Benchmark com tamanhos e formatos de entrada variados.
- Gráficos de tempo e comparações.
- Exportação de resultados em CSV.
- Exibição adaptativa de vetores grandes, com inspeção por posição.
- Interface responsiva, com tema próprio e tipografia dedicada.

## Rotas

- `/`: página inicial e visão geral do projeto.
- `/visualizar`: visualização de ordenação.
- `/buscar`: visualização de busca.
- `/comparar`: benchmark e comparação de desempenho.

## Tecnologias

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS v4
- DaisyUI
- Zustand
- Recharts
- Lucide React

## Como executar

Instale as dependências:

```bash
npm install
```

Execute em desenvolvimento:

```bash
npm run dev
```

Gere a versão de produção:

```bash
npm run build
npm run start
```

Verifique o código:

```bash
npm run lint
npm run build
```

## Estrutura principal

```text
src/
  app/          rotas da aplicação
  components/   interface e visualizações
  hooks/        controle de reprodução
  modules/      algoritmos, tipos, store e utilitários
  shared/       componentes compartilhados
```

## Algoritmos de ordenação

| Algoritmo | Melhor caso | Caso médio | Pior caso | Espaço |
|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |

## Algoritmos de busca

| Algoritmo | Melhor caso | Caso médio | Pior caso | Espaço |
|---|---|---|---|---|
| Busca Sequencial | O(1) | O(n) | O(n) | O(1) |
| Busca Binária | O(1) | O(log n) | O(log n) | O(1) |

## Observações

- O projeto roda no navegador.
- Os benchmarks são executados localmente no cliente.
- O código pode ser apresentado e explicado nas entregas parciais e no relatório técnico.