# Transações e consultas no Datomic

## Transações (write)

Uma **transação** é uma lista de **datoms** a serem adicionados (ou retraídos). Em Clojure, você passa um vetor de mapas para `d/transact` (conexão obtida do Peer ou Client). Cada mapa representa um fato; **:db/id** pode ser um eid existente (para “atualizar”/retrair e adicionar) ou um **tempid** (id temporário) para criar nova entidade.

- **Novo entidade** – Use tempid (ex.: -1); o Transactor substitui por um eid real. Referências a outras entidades novas usam outros tempids (ex.: -2); a ordem pode ser usada para indicar dependência.
- **Adicionar atributo a entidade existente** – Map com :db/id do eid e o atributo/valor.
- **Retração** – Operação **:db/retract** com eid, atributo e valor (ou usar a API de retract do cliente).
- **Identidade** – **:db/ident** em um mapa com tempid define um “ident” global (ex.: :person/name); útil para entidades de referência (enums, lookups).

A transação é **atômica**: ou todos os fatos são aplicados, ou nenhum. O Transactor atribui uma nova transação id e txInstant; os Peers veem o novo estado após a transação ser commitada.

## Datalog: consultas

**Datalog** é a linguagem de consulta do Datomic. Uma query é uma lista: **[:find ?var1 ?var2 ... :where ...]** (e opcionalmente **:in**, **:with**).

- **:find** – Variáveis a retornar (símbolos com ?).
- **:where** – Cláusulas (datoms ou predicados). Cada cláusula é um vetor; ex.: **[?e :person/name ?name]** significa “?e é uma entidade que tem :person/name com valor ?name”.
- **:in** – Inputs (database value, ou variáveis passadas como parâmetro). O valor do banco (db) permite consultar um **point-in-time** (db as-of tx) ou **since** (db since tx).
- **:with** – Variáveis usadas na lógica mas não no :find.

Exemplo: “Nomes de todas as pessoas”:

```clojure
[:find ?name
 :where [?e :person/name ?name]]
```

Com parâmetro de input (db e nome para filtrar):

```clojure
[:find ?e
 :in $ ?nome
 :where [?e :person/name ?nome]]
```

Predicados como **pred** (clojure.core), **get-else**, **missing?** e **tuple** permitem expressar condições mais ricas. **Rules** (regras reutilizáveis) ajudam a compor consultas complexas.

## Pull API

Além de Datalog, o **pull** permite “puxar” uma entidade (ou várias) em estrutura aninhada: você especifica um **pattern** (quais atributos e até que profundidade) e o Datomic retorna um mapa (ou vetor de mapas). Útil para montar DTOs para API sem escrever Datalog manual para cada atributo.

## Histórico e point-in-time

- **db as-of tx** – Banco como era na transação tx (ou no instante t).
- **db since tx** – Apenas fatos adicionados após tx; útil para “o que mudou”.
- **history db** – Banco que inclui todos os fatos (incluindo retraídos); consultas de histórico usam esse db.

Isso permite “time travel”, auditoria e reprocessamento baseado em estado passado.

## Resumo

| Tema | Prática |
|------|---------|
| **Transação** | Lista de mapas (eid ou tempid + atributos); retract para “remover”. |
| **Datalog** | :find, :where, :in; variáveis ?x; point-in-time via db. |
| **Pull** | Pattern para trazer entidade aninhada. |
| **Histórico** | as-of, since, history para auditoria e tempo. |

No próximo capítulo: arquitetura (Transactor, Peers, Storage), deployment e operação.

---

*Próximo: [Arquitetura e operação](./03-arquitetura-operacao.md).*
