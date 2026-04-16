# Mensageria

Sessão dedicada a **filas**, **brokers**, **pub/sub** e **processamento assíncrono** em arquiteturas distribuídas: desde **AMQP (RabbitMQ)** e **filas geridas (SQS)** até **BullMQ** em Node, **MQTT** para IoT, **Redis** como fila leve e o estudo aprofundado de **Apache Kafka**. Inclui um capítulo de **comparativo** entre Kafka, RabbitMQ e SQS para escolha de tecnologia.

Nos capítulos RabbitMQ, SQS, BullMQ, MQTT e Redis há **exemplos explícitos de produção e de consumo** (ficheiros ou processos separados) em **Node.js, Python, Go, Java, C#** quando aplicável, mais **diagramas de microsserviços** que mostram quem publica e quem consome.

---

## Índice

### Mensageria (geral)

1. [RabbitMQ](./01-rabbitmq.md)
2. [Amazon SQS](./02-amazon-sqs.md)
3. [BullMQ](./03-bullmq.md)
4. [Kafka, RabbitMQ e SQS — comparativo](./04-kafka-rabbitmq-sqs-comparativo.md)
5. [MQTT](./05-mqtt.md)
6. [Redis — filas e pub/sub](./06-redis-filas-pubsub.md)

### Estudo aprofundado — Kafka

- [**Kafka – alto desempenho**](../kafka-alto-desempenho/README.md) — conceitos, particionamento, consumidores e padrões de integração.

---

## Tópicos relacionados noutros estudos

| Conteúdo | Onde está |
|----------|-----------|
| **Saga** e idempotência em filas | [APIs e arquitetura — Saga](../apis-arquitetura/06-saga.md) |
| **Webhooks** (*at-least-once* sobre HTTP) | [APIs e arquitetura — Webhooks](../apis-arquitetura/16-webhooks.md) |
| **DynamoDB + Redis** (cache, filas detalhadas) | [Bancos de dados — DynamoDB e Redis](../bancos-de-dados/09-dynamodb-redis.md) |
| **Casos de uso** com Kafka em arquitetura | [Casos de Uso](../casos-uso/README.md) |

---

## Referências gerais

- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/)
- [AWS Well-Architected — Messaging](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/messaging-patterns.html)

---

*Escolha o **transporte** pelo perfil de carga (latência, durabilidade, fan-out, custo operacional) — não pelo hype.*
