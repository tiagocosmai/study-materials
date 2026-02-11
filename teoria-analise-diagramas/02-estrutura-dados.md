# Estruturas de dados na prática

## Por que estruturas de dados em cenários reais

A escolha da estrutura (fila, heap, árvore, grafo, índice) define o custo das operações (inserção, busca, remoção, consultas por intervalo) e o uso de memória. Em sistemas reais, isso se traduz em latência p99, throughput e capacidade de escala. Abaixo, cenários onde a estrutura é decisiva.

## Cenário 1: Cache com capacidade limitada e política de evição (LRU/LFU)

**Situação:** Cache em memória com tamanho máximo N. Em cada acesso (hit ou miss), é preciso atualizar “quem foi usado quando” (LRU) ou “quantas vezes foi usado” (LFU) e, em miss com cache cheio, evictar uma entrada.

**Estruturas:** Para **LRU**: lista duplamente ligada + mapa (chave → nó). Inserção e atualização O(1); eviction O(1) no head/tail. Para **LFU**: manter contador por chave; evictar a de menor contador; em empate, desempate por tempo (LFU com aging). Estruturas auxiliares (heap por frequência, ou buckets por frequência com lista) permitem O(log n) ou O(1) amortizado para atualização e eviction.

**Trade-off:** LRU é simples e bom para padrões temporais; LFU é melhor para itens “quentes” recorrentes. Em sistemas reais, variantes (TinyLFU, W-TinyLFU) equilibram custo de metadados e qualidade de hit rate.

## Cenário 2: Índice para buscas por intervalo e agregação (time series / eventos)

**Situação:** Eventos ou métricas com timestamp; consultas do tipo “todos entre t1 e t2” ou “soma/count entre t1 e t2”, com alta ingestão e consultas ad hoc.

**Estruturas:** Árvore B+ ou LSM-tree (como em bancos de séries temporais): inserção em lote e por ordem de tempo; folhas encadeadas permitem scan de intervalo eficiente. Para agregações (soma, count) pré-computadas: buckets por intervalo (ex.: 1 minuto) em árvore ou em estrutura imutável (append-only), com roll-up para intervalos maiores. Índices secundários (por tag/dimensão) podem ser mantidos em estruturas separadas (ex.: mapa de tag → lista de timestamps ou blocos).

**Complexidade:** Inserção O(log n) ou O(1) amortizado (LSM); consulta de intervalo O(log n + k) onde k é o número de elementos no intervalo; agregação O(1) se pré-agregado por bucket.

## Cenário 3: Grafo de dependências e consultas de alcance (impacto, caminhos)

**Situação:** Entidades (serviços, tabelas, jobs) e dependências entre elas formam um grafo direcionado. Consultas: “quem é impactado se X cair?” (alcance downstream), “quais dependências tem o fluxo A?” (caminhos), “existe ciclo?” (validação).

**Estruturas:** Lista de adjacência (ou mapa de vértice → lista de vizinhos); para grafos grandes, representação distribuída ou em banco (nós e arestas). **Alcance:** BFS/DFS a partir do nó; marcar visitados para não reprocessar. **Ciclos:** DFS com cores (branco/cinza/preto) ou contagem de grau + fila (Kahn). **Caminhos críticos:** pesos nas arestas (duração); longest path em DAG (ordenar topologicamente e relaxar arestas na ordem).

Em microsserviços e pipelines de dados, esse grafo é explícito (configuração) ou derivado (logs, tracing); a estrutura escolhida define o custo de “impacto” e “topologia”.

---

*Próximo: [Fluxograma: símbolos e cenários complexos](./03-fluxograma.md).*
