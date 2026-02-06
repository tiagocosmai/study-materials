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

**Exemplos de aplicação:** registrar cada tentativa de pagamento de boleto ou documento; sinal de vida do app (heartbeat); evento “transação iniciada” ou “tela de extrato visualizada”; auditoria de ações para compliance e análise de comportamento.

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

**O que acontece:** O app envia o evento para a API, que valida o payload e publica em um tópico Kafka. O Kafka armazena as mensagens com retenção configurada (ex.: 7 dias). Vários consumers, em grupo, leem as partições em paralelo: cada mensagem é validada, enriquecida (ex.: geolocalização, contexto do usuário) e então gravada em S3 (cópia bruta para data lake) e no DB (dados processados para consulta). Se um consumer cair, o grupo rebalanceia e as mensagens não confirmadas são reprocessadas; em caso de bug, é possível fazer replay do tópico.

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

**O que acontece:** A API recebe o evento, classifica como alta ou baixa prioridade (ex.: transação financeira → fila alta; heartbeat → fila baixa) e envia a mensagem para a fila correspondente (Redis Streams ou SQS). Workers (pods no Kubernetes, escalonáveis) fazem poll na fila, pegam uma mensagem, processam (validar, enriquecer) e gravam em S3 e DB; após sucesso, removem a mensagem da fila. Se o worker falhar antes de remover, a mensagem volta a ficar disponível após o timeout de visibilidade. Não há retenção longa como no Kafka: após o consumo, a mensagem some.

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

**O que acontece:** A API responde ao cliente assim que grava o evento no Redis (write-through), devolvendo “evento aceito” com baixa latência. Em paralelo, a API (ou um processo interno) publica o mesmo evento no Kafka. Um job em batch (scheduled ou contínuo) consome do Kafka em lotes: aplica validação e enriquecimento em batch e persiste em S3 e DB. A leitura para dashboards ou auditoria usa S3/DB; o Redis pode ser usado para consultas recentes ou contagem em tempo quase real. Se o Redis cair após o write mas antes da publicação no Kafka, há risco de perda; por isso costuma-se usar o Kafka como fonte de verdade assíncrona quando a durabilidade é crítica.

- **Prós:** Resposta rápida ao cliente (write em Redis); processamento pesado em batch; reduz carga direta no DB.
- **Contras:** Risco de perda se Redis cair antes do batch; consistência eventual; lógica duplicada (sync vs batch).

---

## Situação 2: Saldo e histórico de transações com consistência forte

**Problema:** Vários microserviços precisam ler e atualizar saldo e histórico de transações. É obrigatório: consistência forte, auditoria e suporte a alto volume de leitura.

**Exemplos de aplicação:** realizar transferência entre contas; pagar um boleto ou documento; consultar extrato bancário; debitar/creditar em compra com cartão; consultar saldo na tela inicial do app; conciliação e auditoria regulatória.

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

**O que acontece:** Toda escrita (debitar, creditar, registrar transação) vai direto ao DB dentro de uma transação ACID: o saldo e o histórico são atualizados atomicamente. Na leitura (ex.: “consultar extrato” ou “mostrar saldo”), o serviço primeiro consulta o Redis com a chave da conta; se existir (cache hit), devolve o valor. Se não existir (cache miss), lê do DB, grava no Redis com TTL e devolve. Após qualquer escrita no DB, o cache daquela conta é invalidado (ou atualizado), para a próxima leitura ver o valor correto. Assim, leituras repetidas (ex.: várias telas no app) não batem no DB; escritas sempre passam pelo DB como única fonte da verdade.

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

**O que acontece:** Uma operação que altera saldo (ex.: “pagar boleto”) não atualiza saldo diretamente: a API grava um **evento** (ex.: `DebitoRealizado`) no Kafka ou event store, com valor, conta, idempotency key e metadados. Consumidores (projeções) leem esse stream: a projeção “saldo” aplica cada evento e atualiza uma view (ex.: tabela ou Redis) por conta; a projeção “histórico” monta a lista de transações. Quem precisa de saldo ou extrato lê dessas views (Redis ou read DB), não do stream. O stream é a fonte da verdade e vira auditoria natural; novas projeções (ex.: “saldo por dia”) podem ser criadas reprocessando o stream. A leitura é eventualmente consistente: há um pequeno atraso entre o write e a atualização da view.

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

**O que acontece:** Existe um roteador (ou camada no serviço) que, a partir do identificador da conta (ou entidade), decide o shard: por exemplo, `shard_id = hash(conta_id) % N`. Toda leitura e escrita dessa conta (saldo, extrato, débito, crédito) vai para o mesmo shard, que mantém seu próprio ledger e tabelas. Assim, “consultar extrato da conta X” e “debitar na conta X” são resolvidos no mesmo banco (shard), com transações ACID locais. Contas diferentes ficam em shards diferentes, permitindo escalar horizontalmente a escrita. Uma transferência entre duas contas em shards diferentes exige uma transação distribuída ou um fluxo em duas fases (débito em um shard, crédito no outro com compensação em caso de falha), o que aumenta a complexidade.

- **Prós:** Escala horizontal da escrita; transações locais por shard; isolamento de carga por entidade.
- **Contras:** Transações cross-shard complexas; rebalanceamento e crescimento de shards não triviais; design de chave de sharding crítico.

---

## Situação 3: Notificações em tempo quase real para milhões de usuários

**Problema:** Enviar push, e-mail e SMS de forma personalizada, com rate limit por usuário e por canal, fallback entre provedores e alta disponibilidade.

**Exemplos de aplicação:** avisar que um boleto foi pago; alerta de transação em outra cidade; confirmação de transferência recebida; comunicado de manutenção programada; código de verificação (2FA) por SMS ou e-mail; lembrete de fatura.

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

**O que acontece:** Um evento de negócio (ex.: “boleto pago”) é publicado uma vez e replicado ou produzido em três tópicos Kafka: um para push, um para e-mail e um para SMS (ou um único tópico com três consumer groups, um por canal). Cada grupo de consumers lê só o que lhe cabe: o consumer de push consulta preferências e rate limit (ex.: Redis), envia ao provedor de push e commita o offset; o de e-mail e o de SMS fazem o mesmo nos seus canais. Assim, uma falha no provedor de SMS não atrasa push nem e-mail; cada canal escala de forma independente. A política “não enviar e-mail se o push foi entregue” exige um store compartilhado (ex.: Redis) com o status por notificação ou usuário, e os consumers consultam antes de enviar.

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

**O que acontece:** Todas as solicitações de notificação (push, e-mail, SMS) entram na mesma fila (ex.: uma fila SQS ou Redis). Um ou mais workers fazem poll na fila, pegam uma mensagem e executam a lógica centralizada: consultam Redis para rate limit por usuário e por canal (ex.: máximo de 5 SMS/hora), preferências do usuário e regras de fallback (ex.: se push falhar, tentar e-mail). Em seguida escolhem o canal e o provedor e disparam a chamada (HTTP, SDK). Se o provedor principal falhar, o worker tenta o fallback. A deduplicação (evitar enviar a mesma notificação duas vezes) também pode usar Redis. Escalar significa aumentar o número de workers; a fila única pode virar gargalo se o volume for muito alto, e aí entra particionamento por usuário ou por tipo de evento.

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

**O que acontece:** Uma API de notificação única recebe o pedido (“enviar confirmação de transferência para o usuário X”) e decide quais canais usar (push, e-mail, SMS) com base em regras ou preferências. Para cada canal escolhido, a API publica uma mensagem em uma fila dedicada: fila de push, fila de e-mail, fila de SMS. O Serviço de Push consome só da fila de push, aplica rate limit (pode usar Redis compartilhado) e chama o provedor de push; o Serviço de E-mail e o de SMS fazem o mesmo nas suas filas. Assim, a responsabilidade por canal fica isolada: um bug no serviço de SMS não derruba push nem e-mail. A política de “não enviar e-mail se push foi enviado” e o rate limit global ficam na API ou em um componente compartilhado (ex.: Redis com chaves por usuário e por notificação).

- **Prós:** Responsabilidade clara por canal; times podem evoluir cada serviço; isolamento de falhas.
- **Contras:** Mais serviços e filas; política de fallback e rate limit global precisa de componente compartilhado (ex.: API + Redis).

---

## Situação 4: Deploy de serviços críticos sem downtime e com compatibilidade

**Problema:** Serviços que tratam transações e contratos precisam ser atualizados sem derrubar tráfego, com rollback rápido e compatibilidade entre versões antigas e novas (clientes e outros serviços).

**Exemplos de aplicação:** publicar nova versão do serviço de pagamento de boletos; atualizar o serviço que consulta extrato e saldo; liberar nova versão da API de transações; corrigir bug crítico no fluxo de transferência sem interromper o uso.

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

**O que acontece:** Em produção existem dois deployments idênticos em capacidade: Blue (versão atual) e Green (vazio ou espelho). No deploy, a nova versão é colocada no Green; o tráfego continua 100% no Blue. A equipe valida o Green (testes de fumaça, health check, dados de teste). Quando aprovado, o load balancer ou Ingress passa a enviar 100% do tráfego para o Green; o Blue fica ocioso. Em caso de problema, o switch é revertido (tráfego de volta ao Blue), o que dá rollback imediato. Durante o switch, conexões longas (WebSocket, streaming) podem ser encerradas; sessões e estado em memória precisam ser considerados (ex.: sticky session ou estado em Redis).

- **Prós:** Rollback imediato (voltar ao deployment anterior); teste completo do Green antes de cortar tráfego.
- **Contras:** Dobro de recursos durante o switch; migração de estado e conexões longas exigem cuidado; switch é “big bang”.

### Solução B: Canary (percentual de tráfego para nova versão)

```mermaid
flowchart TB
  LB[Ingress]
  LB --> V1[Stable 90%]
  LB --> V2[Canary 10%]
```

**O que acontece:** A nova versão do serviço é implantada junto da antiga no mesmo cluster: por exemplo, 90% dos pods estão na versão estável (v1) e 10% na canary (v2). O Ingress ou service mesh roteia uma parte do tráfego (ex.: 10% por hash do usuário ou aleatório) para os pods canary. Métricas (latência, erro, throughput) são coletadas por versão. Se a canary se comportar bem por um tempo definido, aumenta-se o percentual (ex.: 50%, depois 100%) até substituir totalmente a v1. Se aparecer aumento de erro ou latência, a canary é removida (scale to 0) e o tráfego volta todo para a v1. Contratos (API, eventos) e esquemas de dados precisam ser compatíveis entre v1 e v2, pois ambas recebem tráfego real ao mesmo tempo.

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

**O que acontece:** Há uma única versão do serviço em produção (rolling update no Kubernetes atualiza os pods gradualmente). O comportamento novo (ex.: nova lógica de consulta de extrato) fica atrás de uma feature flag, consultada em tempo de execução em um config store (ex.: Redis, serviço de configuração). Com a flag desligada, o código antigo roda; ligando a flag para 5% dos usuários (por ID, região ou aleatório), apenas essa parcela usa o novo fluxo. Não é necessário novo deploy para ativar ou desativar: muda-se a configuração da flag. Rollback é desligar a flag. A/B tests e rollout por região são naturais. O código acumula `if (featureX) { ... } else { ... }`; é importante limpar flags antigas e evitar muitas ramificações.

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
