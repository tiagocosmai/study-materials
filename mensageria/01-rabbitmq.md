# RabbitMQ — AMQP, exchanges e filas

## Introdução

**RabbitMQ** é um **message broker** open source que implementa **AMQP 0-9-1** (e outros protocolos como MQTT e STOMP via plugins). Produtores publicam mensagens em **exchanges**; estas roteiam para **queues** com base em **bindings**; consumidores **acknowledgam** após processar — padrão clássico para **desacoplar** serviços e absorber picos de carga.

```mermaid
flowchart LR
  P[Producer] --> X[Exchange]
  X -->|binding key| Q1[Queue A]
  X --> Q2[Queue B]
  Q1 --> C1[Consumer]
  Q2 --> C2[Consumer]
```

---

## Conceitos AMQP

| Conceito | Descrição |
|----------|-----------|
| **Exchange** | Ponto de entrada; aplica regras de roteamento |
| **Queue** | Buffer FIFO (com prioridades opcionais) |
| **Binding** | Liga exchange ↔ queue com *routing key* ou padrão |
| **Channel** | Multiplexação leve sobre uma conexão TCP |
| **Ack** | Confirmação ao broker após processamento |

Tipos de exchange comuns:

| Tipo | Roteamento |
|------|------------|
| **direct** | Routing key exata |
| **topic** | Wildcards `*` e `#` |
| **fanout** | Copia para todas as filas ligadas |
| **headers** | Baseado em cabeçalhos da mensagem |

---

## Laboratório com Docker

```yaml
# docker-compose.yml (trecho)
services:
  rabbit:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
```

- **AMQP:** `localhost:5672`
- **Management UI:** `http://localhost:15672`

```mermaid
sequenceDiagram
  participant App as Producer
  participant R as RabbitMQ
  participant W as Worker
  App->>R: basic.publish
  R->>W: basic.deliver
  W->>R: basic.ack
```

---

## Boas práticas

- **Prefetch (`qos`)** — limite de mensagens *in-flight* por consumidor para evitar desbalanceamento.
- **DLX** (*Dead-letter exchange*) — fila de mensagens falhadas + TTL para *poison pills*.
- **Filas duráveis** + mensagens **persistentes** (com custo de I/O) quando não pode perder dados após restart do broker.

---

## Exemplos de código

### Node.js (`amqplib`)

```javascript
import amqp from "amqplib";

async function main() {
  const conn = await amqp.connect("amqp://guest:guest@localhost:5672");
  const ch = await conn.createChannel();
  const q = "tasks";
  await ch.assertQueue(q, { durable: true });
  ch.sendToQueue(q, Buffer.from(JSON.stringify({ id: 1, type: "email" })), { persistent: true });
  await ch.consume(q, (msg) => {
    if (!msg) return;
    console.log(msg.content.toString());
    ch.ack(msg);
  });
}

main().catch(console.error);
```

### Python (`pika`)

```python
import json
import pika

def main() -> None:
    params = pika.URLParameters("amqp://guest:guest@localhost:5672/")
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue="tasks", durable=True)
    ch.basic_publish(exchange="", routing_key="tasks", body=json.dumps({"id": 1}).encode(), properties=pika.BasicProperties(delivery_mode=2))
    conn.close()

if __name__ == "__main__":
    main()
```

### Java (Spring AMQP — ideia)

```java
// @RabbitListener(queues = "tasks") + RabbitTemplate.convertAndSend("tasks", payload)
```

### Go (`amqp091-go`)

```go
package main

import (
	"log"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(err)
	}
	defer ch.Close()
	_, err = ch.QueueDeclare("tasks", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}
	err = ch.Publish("", "tasks", false, false, amqp.Publishing{Body: []byte(`{"id":1}`)})
	if err != nil {
		log.Fatal(err)
	}
}
```

### C# (RabbitMQ.Client)

```csharp
using var conn = new RabbitMQ.Client.ConnectionFactory
{
    HostName = "localhost",
    UserName = "guest",
    Password = "guest",
}.CreateConnection();
using var ch = conn.CreateModel();
ch.QueueDeclare("tasks", durable: true, exclusive: false, autoDelete: false);
var body = System.Text.Encoding.UTF8.GetBytes("{\"id\":1}");
ch.BasicPublish("", "tasks", null, body);
```

---

## Quando considerar outra ferramenta

Ver [comparativo Kafka / RabbitMQ / SQS](./04-kafka-rabbitmq-sqs-comparativo.md). RabbitMQ brilha em **roteamento flexível** e **baixa latência** com broker único ou cluster clássico; **Kafka** em **log durável** e alto throughput de leitura repetida; **SQS** em **filas geridas** sem operar broker.

---

## Referências

- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [AMQP 0-9-1 Model](https://www.rabbitmq.com/tutorials/amqp-concepts.html)

---

*RabbitMQ é **broker de propósito geral**; o desenho correto de **exchanges e bindings** evita filas monolíticas impossíveis de escalar.*
