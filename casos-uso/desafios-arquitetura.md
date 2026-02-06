# Casos de Uso

## Desafios de arquitetura

Nesta seção são apresentados problemas de arquitetura típicos de ecossistemas robustos e escaláveis. Para cada situação há **várias soluções possíveis** (não uma única correta). O objetivo é praticar:

- Entendimento de diferentes ferramentas (Kubernetes, Redis, Kafka, S3, microserviços)
- Abordagem sustentável, flexível e escalável
- Trade-offs e comunicação de prós e contras

*Contexto assumido: cloud, Kubernetes, armazenamento objeto (S3), filas/streams (Kafka), cache (Redis), microserviços e escala horizontal.*

---

## Situação 1: Ingestão e processamento de eventos em alto volume

**Problema:** Aplicações móveis e web disparam milhões de eventos por minuto (cliques, transações, sinais de vida). É preciso ingerir, validar, enriquecer e persistir sem perder dados e com latência aceitável para o negócio.

### Solução A: API → Kafka → Consumers → S3 + DB

```mermaid
flowchart LR
  subgraph Clients
    APP[Apps]
  end
  subgraph Ingest
    API[API Gateway]
    K[Kafka]
  end
  subgraph Process
    C1[Consumer 1]
    C2[Consumer N]
  end
  subgraph Storage
    S3[(S3)]
    DB[(DB)]
  end
  APP --> API --> K --> C1 & C2
  C1 & C2 --> S3
  C1 & C2 --> DB
```

- **Prós:** Kafka absorve picos, desacopla ingestão do processamento, replay possível, consumidores escalam horizontalmente.
- **Contras:** Mais componentes e operação (Kafka, consumer groups); latência end-to-end maior; exige idempotência e ordenação bem definida nos consumers.

### Solução B: API → Filas por prioridade (Redis / SQS) → Workers → S3 + DB

```mermaid
flowchart LR
  subgraph Clients
    APP[Apps]
  end
  subgraph Ingest
    API[API]
    Q1[Queue High]
    Q2[Queue Low]
  end
  subgraph Workers
    W1[Worker]
    W2[Worker]
  end
  subgraph Storage
    S3[(S3)]
    DB[(DB)]
  end
  APP --> API --> Q1 & Q2
  Q1 & Q2 --> W1 & W2
  W1 & W2 --> S3 & DB
```

- **Prós:** Modelo mais simples (push em fila, workers consomem); priorização por fila; Redis/SQS bem conhecidos.
- **Contras:** Replay e retenção limitados; em escala muito alta, filas podem virar gargalo; menos adequado para “stream” contínuo e múltiplos consumidores.

### Solução C: API síncrona + write-through cache e batch assíncrono

```mermaid
flowchart LR
  subgraph Clients
    APP[Apps]
  end
  subgraph Sync
    API[API]
    R[Redis]
  end
  subgraph Async
    B[Batch Job]
    K[Kafka]
  end
  subgraph Storage
    S3[(S3)]
    DB[(DB)]
  end
  APP --> API --> R
  API --> K
  K --> B --> S3 & DB
```

- **Prós:** Resposta rápida ao cliente (write em Redis); processamento pesado em batch; reduz carga direta no DB.
- **Contras:** Risco de perda se Redis cair antes do batch; consistência eventual; lógica duplicada (sync vs batch).

---

## Situação 2: Saldo e histórico de transações com consistência forte

**Problema:** Vários microserviços precisam ler e atualizar saldo e histórico de transações. É obrigatório: consistência forte, auditoria e suporte a alto volume de leitura.

### Solução A: DB transacional único (fonte da verdade) + cache de leitura (Redis)

```mermaid
flowchart TB
  subgraph Services
    S1[Service A]
    S2[Service B]
  end
  subgraph Data
    R[Redis Cache]
    DB[(Primary DB)]
  end
  S1 & S2 --> R
  S1 & S2 --> DB
  R -.->|read-through| DB
```

- **Prós:** Modelo simples; transações ACID; Redis reduz carga de leitura no DB.
- **Contras:** DB pode virar gargalo de escrita; cache invalidation e consistência cache-DB são críticos; limite de escala vertical do primary.

### Solução B: Event Sourcing + CQRS (write em stream, leitura em projeções)

```mermaid
flowchart LR
  subgraph Write
    API[API]
    K[Kafka / Event Store]
  end
  subgraph Projections
    P1[Balance View]
    P2[History View]
  end
  subgraph Read
    R[Redis / Read DB]
  end
  API --> K
  K --> P1 & P2
  P1 & P2 --> R
```

- **Prós:** Auditoria natural (log de eventos); escalabilidade de leitura independente; replay e novas projeções sem alterar o core.
- **Contras:** Complexidade operacional e de desenvolvimento; consistência eventual na leitura; necessidade de idempotência e tratamento de atrasos nas projeções.

### Solução C: Sharding por conta/entidade + ledger por shard

```mermaid
flowchart TB
  subgraph Router
    R[Router]
  end
  subgraph Shards
    SH1[(Shard 1)]
    SH2[(Shard 2)]
    SHN[(Shard N)]
  end
  R --> SH1 & SH2 & SHN
```

- **Prós:** Escala horizontal da escrita; transações locais por shard; isolamento de carga por entidade.
- **Contras:** Transações cross-shard complexas; rebalanceamento e crescimento de shards não triviais; design de chave de sharding crítico.

---

## Situação 3: Notificações em tempo quase real para milhões de usuários

**Problema:** Enviar push, e-mail e SMS de forma personalizada, com rate limit por usuário e por canal, fallback entre provedores e alta disponibilidade.

### Solução A: Kafka por canal (push, email, SMS) → consumers → provedores

```mermaid
flowchart LR
  subgraph Producers
    E[Event Source]
  end
  subgraph Kafka
    KP[Topic Push]
    KE[Topic Email]
    KS[Topic SMS]
  end
  subgraph Consumers
    CP[Consumer Push]
    CE[Consumer Email]
    CS[Consumer SMS]
  end
  E --> KP & KE & KS
  KP --> CP
  KE --> CE
  KS --> CS
```

- **Prós:** Um canal não bloqueia o outro; backpressure e retenção do Kafka; múltiplos consumers por canal.
- **Contras:** Rate limit e estado por usuário exigem store (ex.: Redis); coordenação entre canais (ex.: “não enviar email se push ok”) mais complexa.

### Solução B: Fila única + worker que roteia e aplica rate limit (Redis)

```mermaid
flowchart TB
  subgraph In
    Q[Single Queue]
  end
  subgraph Worker
    W[Router + Rate Limiter]
  end
  subgraph Redis
    RL[Rate Limit Keys]
  end
  subgraph Providers
    P1[Push]
    P2[Email]
    P3[SMS]
  end
  Q --> W
  W --> RL
  W --> P1 & P2 & P3
```

- **Prós:** Lógica de roteamento e fallback centralizada; Redis para rate limit e deduplicação; menos tópicos para operar.
- **Contras:** Worker pode virar gargalo; uma falha afeta todos os canais; escalar exige particionamento cuidadoso da fila.

### Solução C: Serviço por canal + API de notificação + filas internas

```mermaid
flowchart LR
  subgraph API
    N[Notification API]
  end
  subgraph Services
    SP[Push Service]
    SE[Email Service]
    SS[SMS Service]
  end
  subgraph Queues
    QP[Q Push]
    QE[Q Email]
    QS[Q SMS]
  end
  N --> QP & QE & QS
  QP --> SP
  QE --> SE
  QS --> SS
```

- **Prós:** Responsabilidade clara por canal; times podem evoluir cada serviço; isolamento de falhas.
- **Contras:** Mais serviços e filas; política de fallback e rate limit global precisa de componente compartilhado (ex.: API + Redis).

---

## Situação 4: Deploy de serviços críticos sem downtime e com compatibilidade

**Problema:** Serviços que tratam transações e contratos precisam ser atualizados sem derrubar tráfego, com rollback rápido e compatibilidade entre versões antigas e novas (clientes e outros serviços).

### Solução A: Blue/Green no Kubernetes (dois deployments, switch de tráfego)

```mermaid
flowchart LR
  subgraph Ingress
    LB[Load Balancer]
  end
  subgraph K8s
    B[Blue Deployment]
    G[Green Deployment]
  end
  LB --> B
  LB -.->|switch| G
```

- **Prós:** Rollback imediato (voltar ao deployment anterior); teste completo do Green antes de cortar tráfego.
- **Contras:** Dobro de recursos durante o switch; migração de estado e conexões longas exigem cuidado; switch é “big bang”.

### Solução B: Canary (percentual de tráfego para nova versão)

```mermaid
flowchart TB
  LB[Ingress]
  LB --> V1[Stable 90%]
  LB --> V2[Canary 10%]
```

- **Prós:** Rollout gradual; detecção de erros com impacto limitado; possível automatizar (métricas, rollback).
- **Contras:** Compatibilidade de contrato e dados entre versões obrigatória; configuração de roteamento e métricas mais elaborada.

### Solução C: Feature flags + rolling update (uma versão, flags ligam comportamento)

```mermaid
flowchart LR
  subgraph App
    A[Single Version]
    FF[Feature Flags]
  end
  subgraph Config
    CF[Config Store]
  end
  A --> FF
  FF --> CF
```

- **Prós:** Uma base de código; ativação/desativação sem novo deploy; A/B e rollout por usuário ou região.
- **Contras:** Código pode acumular ramos condicionais; gestão de flags e limpeza necessárias; configuração distribuída e latência de propagação.

---

## Resumo de trade-offs recorrentes

| Tema | Trade-off |
|------|-----------|
| **Throughput vs latência** | Kafka/streams dão throughput e retenção, mas aumentam latência; filas + workers podem reduzir latência com menos retenção. |
| **Consistência vs escala** | DB único + cache é mais simples e forte consistência; event sourcing e sharding escalam melhor com consistência eventual ou por entidade. |
| **Acoplamento vs operação** | Menos componentes (fila única, um serviço) simplificam; mais componentes (Kafka por canal, serviço por canal) isolam e escalam de forma independente. |
| **Deploy** | Blue/Green = rollback rápido e recurso duplicado; Canary = rollout gradual; Feature flags = flexibilidade sem novo deploy, com dívida de flags. |

*Use estes cenários para praticar desenho no quadro e discussão de trade-offs em entrevistas.*
