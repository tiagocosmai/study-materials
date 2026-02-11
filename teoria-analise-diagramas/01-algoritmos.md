# Algoritmos em contextos reais

## Papel da análise algorítmica

Em situações reais, a escolha e o desenho de algoritmos impactam latência, custo e escalabilidade. Este capítulo trata de cenários **não triviais**: conciliação de grandes volumes, agendamento com restrições, matching com prioridades e decisões sob incerteza. A ideia é ligar a teoria (complexidade, estruturas, invariantes) à prática (throughput, SLA, regras de negócio).

## Cenário 1: Conciliação de transações em lote (match por chave e janela temporal)

**Situação:** Duas fontes emitem eventos de débito e crédito (ex.: pagamentos e liquidações). É preciso **conciliar** em lote: para cada débito, encontrar o(s) crédito(s) que o cobrem, respeitando regras de janela temporal, moeda e idempotência, e produzir um relatório de matched/unmatched sem cruzar um mesmo crédito com mais de um débito (ou vice-versa, conforme a regra).

**Algoritmo em alto nível:** Ordenar as duas listas por chave de negócio e data; percorrer com dois ponteiros (ou um índice) mantendo uma janela de créditos candidatos; para cada débito, aplicar matching (FIFO ou por prioridade) dentro da janela; marcar itens já matched para não reutilizar. Complexidade típica O(n log n) por causa da ordenação; o scan é O(n + m).

**Invariante:** Em todo momento, créditos já consumidos na janela não podem ser usados de novo; a ordem de processamento (ex.: por data) deve ser estável e documentada para auditoria.

## Cenário 2: Agendamento de jobs com dependências e recursos limitados

**Situação:** N jobs com dependências (DAG), cada um com duração e requisito de recurso (ex.: 1 worker, N workers, ou recurso exclusivo). Poucos workers disponíveis. Objetivo: minimizar makespan (tempo total) ou atender deadlines, respeitando dependências e capacidade.

**Abordagem:** Ordenação topológica do DAG; em cada “instante” (evento de início/fim de job), calcular quais jobs estão prontos (predecessores concluídos) e alocar aos workers disponíveis. Estratégia de escolha: maior duração primeiro (LPT), ou maior folga (slack) primeiro, ou prioridade por deadline. Em geral o problema é NP-difícil; heurísticas (list scheduling, critical path) são usadas na prática.

**Uso de estruturas:** Fila de prioridade para “jobs prontos”; estrutura que responda “quando o worker X fica livre” (eventos em ordem cronológica) para simulação discreta.

## Cenário 3: Matching com prioridade e restrições (alocação de oferta e demanda)

**Situação:** Ofertas (ex.: lotes de ativo) e demandas (ordens) com preço, quantidade e prioridade (tempo, tipo de cliente). Regras: preço compatível, quantidade parcial permitida ou não, “fill or kill”. Objetivo: maximizar volume matched ou utilidade, respeitando restrições.

**Abordagem:** Ordenar ofertas e demandas (ex.: oferta por preço ascendente, demanda por descendente); matching guloso na ordem, consumindo quantidade até esgotar oferta ou demanda. Se houver prioridade explícita (ex.: ordem de chegada ou tipo), manter uma estrutura ordenada por prioridade e, a cada passo, pegar a melhor oferta e a melhor demanda compatíveis. Restrições (fill or kill) podem exigir backtrack limitado ou programação dinâmica em instâncias pequenas.

A análise de **complexidade** (tempo e espaço) e de **casos extremos** (tudo unmatched, tudo matched, uma oferta atendendo muitas demandas) ajuda a validar limites e SLA em produção.

---

*Próximo: [Estruturas de dados na prática](./02-estrutura-dados.md).*
