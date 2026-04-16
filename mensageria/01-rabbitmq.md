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

## Arquitetura de microsserviços (exemplo)

Cenário: o **Order Service** grava o pedido na base e publica `OrderCreated`; o **Notification Service** e o **Inventory Service** consomem da mesma fila ou de *bindings* distintos num *topic exchange*.

```mermaid
flowchart TB
  subgraph edge[API]
    GW[API Gateway]
    ORD[Order Service]
  end
  subgraph broker[RabbitMQ]
    X[orders.events topic]
    QN[queue notifications]
    QI[queue inventory]
  end
  subgraph workers[Consumidores]
    NOTIF[Notification Service]
    INV[Inventory Service]
  end
  GW --> ORD
  ORD -->|publish order.created| X
  X --> QN --> NOTIF
  X --> QI --> INV
```

- **Produção:** só o Order Service publica (após transação local *outbox* ou commit).
- **Consumo:** cada microserviço tem a sua **fila** e *binding* — falha no Inventory não bloqueia notificações.

```mermaid
flowchart LR
  subgraph idempotência[Regra de ouro]
    M[Mensagem com orderId]
    DB[(Estado processado?)]
    M --> DB
    DB -->|sim| SKIP[Skip]
    DB -->|não| WORK[Processar + marcar]
  end
```

---

## Boas práticas

- **Prefetch (`qos`)** — limite de mensagens *in-flight* por consumidor para evitar desbalanceamento.
- **DLX** (*Dead-letter exchange*) — fila de mensagens falhadas + TTL para *poison pills*.
- **Filas duráveis** + mensagens **persistentes** (com custo de I/O) quando não pode perder dados após restart do broker.

---

## Produção e consumo de mensagens (por linguagem)

Cada par **publica** num processo e **consome** noutro (ou no mesmo ficheiro em laboratório, com dois terminais). Fila usada: `tasks` (default exchange, *routing key* = nome da fila).

### Node.js (`amqplib`) — produtor

```javascript
// producer.mjs — executar: node producer.mjs
import amqp from "amqplib";

const conn = await amqp.connect("amqp://guest:guest@localhost:5672");
const ch = await conn.createChannel();
await ch.assertQueue("tasks", { durable: true });
const payload = { type: "email", to: "user@example.com", orderId: "ord-1001" };
ch.sendToQueue("tasks", Buffer.from(JSON.stringify(payload)), { persistent: true });
console.log("enviado", payload.orderId);
await ch.close();
await conn.close();
```

### Node.js — consumidor

```javascript
// consumer.mjs — executar noutro terminal: node consumer.mjs
import amqp from "amqplib";

const conn = await amqp.connect("amqp://guest:guest@localhost:5672");
const ch = await conn.createChannel();
await ch.assertQueue("tasks", { durable: true });
await ch.prefetch(1);
await ch.consume(
  "tasks",
  (msg) => {
    if (!msg) return;
    try {
      const body = JSON.parse(msg.content.toString());
      console.log("processar", body);
      ch.ack(msg);
    } catch (e) {
      ch.nack(msg, false, false);
    }
  },
  { noAck: false },
);
```

### Python (`pika`) — produtor

```python
# producer.py
import json
import pika

def main() -> None:
    params = pika.URLParameters("amqp://guest:guest@localhost:5672/")
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue="tasks", durable=True)
    body = {"type": "email", "to": "user@example.com", "orderId": "ord-1001"}
    ch.basic_publish(
        exchange="",
        routing_key="tasks",
        body=json.dumps(body).encode(),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    conn.close()

if __name__ == "__main__":
    main()
```

### Python — consumidor

```python
# consumer.py
import json
import pika

def on_message(ch, method, _props, body):
    data = json.loads(body)
    print("processar", data)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main() -> None:
    params = pika.URLParameters("amqp://guest:guest@localhost:5672/")
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue="tasks", durable=True)
    ch.basic_qos(prefetch_count=1)
    ch.basic_consume(queue="tasks", on_message_callback=on_message, auto_ack=False)
    ch.start_consuming()

if __name__ == "__main__":
    main()
```

### Go (`amqp091-go`) — produtor

```go
// producer.go — go run producer.go
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
	err = ch.Publish("", "tasks", false, false, amqp.Publishing{
		ContentType:  "application/json",
		Body:         []byte(`{"type":"email","orderId":"ord-1001"}`),
		DeliveryMode: 2,
	})
	if err != nil {
		log.Fatal(err)
	}
}
```

### Go — consumidor

```go
// consumer.go — go run consumer.go
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
	err = ch.Qos(1, 0, false)
	if err != nil {
		log.Fatal(err)
	}
	msgs, err := ch.Consume("tasks", "", false, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}
	for d := range msgs {
		log.Println("processar", string(d.Body))
		d.Ack(false)
	}
}
```

### C# (`RabbitMQ.Client`) — produtor

```csharp
// Producer.cs — dotnet run no projeto console
using var conn = new RabbitMQ.Client.ConnectionFactory
{
    HostName = "localhost",
    UserName = "guest",
    Password = "guest",
}.CreateConnection();
using var ch = conn.CreateModel();
ch.QueueDeclare("tasks", durable: true, exclusive: false, autoDelete: false);
var json = """{"type":"email","orderId":"ord-1001"}""";
ch.BasicPublish("", "tasks", null, System.Text.Encoding.UTF8.GetBytes(json));
```

### C# — consumidor

```csharp
// Consumer.cs
using var conn = new RabbitMQ.Client.ConnectionFactory
{
    HostName = "localhost",
    UserName = "guest",
    Password = "guest",
}.CreateConnection();
using var ch = conn.CreateModel();
ch.QueueDeclare("tasks", durable: true, exclusive: false, autoDelete: false);
ch.BasicQos(0, 1, false);
var consumer = new RabbitMQ.Client.Events.EventingBasicConsumer(ch);
consumer.Received += (_, ea) =>
{
    var body = System.Text.Encoding.UTF8.GetString(ea.Body.Span);
    Console.WriteLine("processar " + body);
    ch.BasicAck(ea.DeliveryTag, false);
};
ch.BasicConsume("tasks", false, consumer);
Console.ReadLine();
```

### Java (Spring Boot + Spring AMQP)

**Produtor** — injetar `RabbitTemplate` e enviar após criar pedido:

```java
@Service
public class OrderEvents {
  private final RabbitTemplate rabbit;

  public OrderEvents(RabbitTemplate rabbit) { this.rabbit = rabbit; }

  public void publishOrderCreated(String orderId) {
    rabbit.convertAndSend("", "tasks", Map.of("type", "order.created", "orderId", orderId));
  }
}
```

**Consumidor:**

```java
@Component
public class TaskListener {
  @RabbitListener(queues = "tasks", ackMode = "MANUAL")
  public void onMessage(String payload, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag)
      throws IOException {
    System.out.println("processar " + payload);
    channel.basicAck(tag, false);
  }
}
```

*(Configuração típica: `spring.rabbitmq.host=localhost` e `CachingConnectionFactory`.)*

---

## Quando considerar outra ferramenta

Ver [comparativo Kafka / RabbitMQ / SQS](./04-kafka-rabbitmq-sqs-comparativo.md). RabbitMQ brilha em **roteamento flexível** e **baixa latência** com broker único ou cluster clássico; **Kafka** em **log durável** e alto throughput de leitura repetida; **SQS** em **filas geridas** sem operar broker.

---

## Referências

- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [AMQP 0-9-1 Model](https://www.rabbitmq.com/tutorials/amqp-concepts.html)

---

*RabbitMQ é **broker de propósito geral**; o desenho correto de **exchanges e bindings** evita filas monolíticas impossíveis de escalar.*
