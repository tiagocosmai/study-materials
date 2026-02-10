# Capacidade, desempenho e boas práticas no DynamoDB

## Capacidade: provisionada e on-demand

- **Provisionada** – Você define **RCU** (Read Capacity Units) e **WCU** (Write Capacity Units) por tabela (e por GSI). 1 RCU = 1 leitura forte consistente por segundo (até 4 KB); 1 WCU = 1 escrita por segundo (até 1 KB). Auto Scaling pode ajustar RCU/WCU dentro de limites. Previsível para cargas estáveis.
- **On-demand** – Sem definir capacidade; o DynamoDB escala automaticamente; cobrança por leitura/escrita consumida. Adequado para cargas variáveis ou imprevisíveis; pode ser mais caro em carga alta e estável.
- **Escolha** – On-demand simplifica operação; provisionada pode ser mais econômica com carga previsível e Auto Scaling bem configurado.

## Desempenho e partições quentes

- **Partition hot** – Uma partition key com muita leitura ou escrita concentrada; a partição tem limite de 3000 RCU ou 1000 WCU (valores típicos). Se ultrapassar, o DynamoDB retorna throttling (erro de capacidade). Solução: espalhar a carga (partition key mais granular, ex.: user_id#shard_id, ou usar padrão que distribua melhor).
- **Itens grandes** – Itens até 400 KB; itens grandes consomem mais RCU/WCU por operação. Considere comprimir ou mover dados grandes para S3 e guardar referência no DynamoDB.
- **Batch** – BatchGetItem e BatchWriteItem reduzem chamadas de rede; respeite limites (BatchWriteItem até 25 itens, 16 MB total).

## Single-table design (opcional)

Em **single-table design**, várias entidades lógicas (usuários, pedidos, itens) ficam na **mesma tabela**, diferenciadas por um atributo de “tipo” (ex.: PK = user_#id, SK = METADATA; ou PK = user_#id, SK = order_#id). A chave primária e os GSIs são desenhados para atender todos os padrões de acesso com uma única tabela. Vantagens: menos tabelas, transações entre entidades na mesma tabela (TransactWriteItems); desvantagem: modelagem mais complexa e cuidado com tamanho de itens por partição (10 GB por partition key).

## Transações

- **TransactWriteItems** – Até 100 itens em uma transação atômica (Put, Update, Delete, ConditionCheck). Consome 2x WCU (por item) em relação a writes normais. Use para operações que precisam de atomicidade entre várias tabelas ou itens.
- **TransactGetItems** – Até 100 GetItem em uma transação de leitura; consistência atômica.

## Boas práticas

- **Chave primária** – Escolha que distribua bem e suporte os acessos mais frequentes (Query por partition key).
- **Índices** – Crie GSI apenas para padrões de acesso reais; cada GSI tem custo de armazenamento e capacidade.
- **Evite Scan** – Prefira Query com partition key; use GSI se precisar acessar por outro atributo.
- **Condições** – Use ConditionExpression para evitar sobrescritas e para optimistic locking (versão).
- **Backup** – Point-in-time recovery (PITR) e backups sob demanda; ative conforme política de DR.
- **Streams** – DynamoDB Streams para reação a mudanças (Lambda, replicação); útil para event-driven e cache.

Com isso, você tem uma visão completa do **armazenamento de dados no DynamoDB**: modelo, chaves, operações, índices, capacidade e boas práticas para uso em aplicações na AWS.

---

*Voltar ao [índice](./README.md).*
