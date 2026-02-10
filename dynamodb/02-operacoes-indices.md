# Operações, índices e consultas no DynamoDB

## Operações principais

| Operação | Uso | Custo típico |
|----------|-----|----------------|
| **GetItem** | Buscar um item pela chave primária (partition + sort se houver). | 1 unidade de leitura por 4 KB; muito eficiente. |
| **PutItem** | Inserir ou substituir item (chave primária). | 1 unidade de escrita por 1 KB. |
| **UpdateItem** | Atualizar atributos (parcial); suporta condições (ConditionExpression). | Escritas proporcional ao tamanho. |
| **DeleteItem** | Remover item pela chave primária. | 1 unidade de escrita. |
| **Query** | Retornar itens com mesma partition key; opcionalmente filtrar/ordenar por sort key (KeyConditionExpression). Paginação com Limit e ExclusiveStartKey. | Unidades de leitura pelos itens lidos. |
| **Scan** | Varre a tabela; FilterExpression opcional. Paginação obrigatória em tabelas grandes. | Lê toda a tabela (ou segmentos); caro. |
| **BatchGetItem** | Múltiplos GetItem em uma chamada (até 100 itens). | Proporcional aos itens. |
| **BatchWriteItem** | Múltiplos Put/Delete (até 25). | Proporcional às escritas. |

**ConditionExpression** evita sobrescrever acidentalmente (ex.: PutItem só se o item não existir, ou UpdateItem só se versão = X para optimistic locking).

## Índices secundários

- **GSI (Global Secondary Index)** – Índice com sua própria partition key (e opcional sort key); pode usar atributos diferentes da tabela base. A tabela e o GSI são eventualmente consistentes (ou strongly consistent, se solicitado na leitura). Throughput do GSI é configurado separadamente (ou on-demand). Use para acessar itens por “outra chave” (ex.: pedidos por status, usuários por email).
- **LSI (Local Secondary Index)** – Mesma partition key da tabela, sort key diferente. Só pode ser criado na criação da tabela; compartilha a capacidade da partição. Use para outro ordenamento dentro da mesma partition (ex.: user_id + order_date na tabela, LSI com user_id + status para Query por status).

Consulta ao índice: **Query** com nome do índice; retorna itens do índice (projeção: todos os atributos ou subconjunto). GetItem não funciona em índice; use Query.

## Filtros e expressões

- **KeyConditionExpression** – Condição na chave (Query); ex.: partition key = :pk AND sort key BETWEEN :sk1 AND :sk2.
- **FilterExpression** – Filtra resultados após a leitura (Query/Scan); não reduz custo de leitura (você paga pelos itens lidos antes do filtro). Use para reduzir dados retornados, não como substituto de índice.
- **ProjectionExpression** – Lista de atributos a retornar; reduz payload e custo de dados transferidos.
- **ConditionExpression** – Em Put/Update/Delete; ex.: attribute_not_exists(id) para insert único.

## Resumo

| Tema | Prática |
|------|---------|
| **GetItem / Query** | Preferir a chave primária; Query na partition key (+ condição na sort). |
| **Scan** | Evitar em tabelas grandes; se necessário, paginar e usar FilterExpression. |
| **GSI** | Acesso por “outra chave”; definir projeção e capacidade. |
| **Condições** | ConditionExpression para idempotência e optimistic locking. |

No próximo capítulo: capacidade (provisionada vs on-demand), desempenho, single-table design e boas práticas.

---

*Próximo: [Capacidade, desempenho e boas práticas](./03-capacidade-boas-praticas.md).*
