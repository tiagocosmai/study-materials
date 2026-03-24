# RESTful — recursos, representações e HATEOAS leve

## Introdução

**REST** (Representational State Transfer) descreve um **estilo arquitetural** usando HTTP: recursos nomeados por **URIs**, manipulados com **métodos** e representados por **formatos** (JSON, XML). “RESTful” na prática costuma significar **CRUD orientado a recursos** + status HTTP corretos — nem todo sistema precisa de HATEOAS completo.

```mermaid
flowchart LR
  R[/users/{id}] --> GET[GET ler]
  R --> PUT[PUT substituir]
  R --> DEL[DELETE remover]
  RC[/users] --> POST[POST criar]
```

---

## Recursos e URIs

- **Substantivos** no plural (`/orders`, `/orders/{id}/lines`) em vez de verbos na URL (`/createOrder`).
- **IDs** estáveis; **relacionamentos** aninhados com moderação (evitar árvores profundas difíceis de cachear).

---

## Representação JSON típica

```json
{
  "id": "o-42",
  "status": "PAID",
  "links": {
    "self": "/v1/orders/o-42",
    "customer": "/v1/customers/c-9"
  }
}
```

**HATEOAS** forte inclui hiperlinks para ações possíveis; muitas APIs expõem só `self` ou nada, priorizando simplicidade.

---

## Códigos e erros

| Situação | Status sugerido |
|----------|-----------------|
| Criação com sucesso | `201` + `Location` |
| Sem corpo | `204` |
| Validação de negócio | `422` ou `400` (padronize o time) |
| Conflito de versão | `409` |
| Autenticação ausente | `401` |
| Autorização negada | `403` |

Corpo de erro **estruturado** (ver artigo de normalização).

---

## Paginação e filtros

- Query params: `?page=2&size=20`, `?status=open`.
- Cabeçalhos `Link` ou objeto `{ items, nextCursor }` para cursores.

---

## Exemplos — servidor mínimo

### Spring Boot (Java)

```java
@RestController
@RequestMapping("/v1/items")
public class ItemController {
  @GetMapping("/{id}")
  public ItemDto get(@PathVariable String id) { /* ... */ return new ItemDto(id, "x"); }

  @PostMapping
  public ResponseEntity<ItemDto> create(@RequestBody CreateItemRequest body) {
    var created = new ItemDto("new-id", body.name());
    return ResponseEntity.status(HttpStatus.CREATED)
        .location(URI.create("/v1/items/" + created.id()))
        .body(created);
  }
}
```

### ASP.NET Core (C#)

```csharp
app.MapGet("/v1/items/{id}", (string id) => Results.Ok(new { id, name = "x" }));
app.MapPost("/v1/items", (CreateItemDto body) =>
    Results.Created($"/v1/items/new-id", new { id = "new-id", body.Name }));
```

### Express (JavaScript)

```javascript
app.get("/v1/items/:id", (req, res) => res.json({ id: req.params.id, name: "x" }));
app.post("/v1/items", express.json(), (req, res) =>
  res.status(201).location("/v1/items/new-id").json({ id: "new-id", ...req.body })
);
```

### FastAPI (Python)

```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/v1/items/{item_id}")
def get_item(item_id: str):
    return {"id": item_id, "name": "x"}

@app.post("/v1/items", status_code=201)
def create_item(body: dict, response: Response):
    response.headers["Location"] = "/v1/items/new-id"
    return {"id": "new-id", **body}
```

---

## Versionamento

- **Path** `/v1/...` (explícito, fácil de rotear).
- **Header** `Accept: application/vnd.company.v2+json` (mais flexível, menos visível).

---

## Referências

- Fielding, R. *Architectural Styles and the Design of Network-based Software Architectures* (dissertação REST).
- Richardson, L. & Ruby, S. *RESTful Web APIs*.

---

*REST bem feito é **contrato claro + HTTP honesto**; GraphQL e gRPC resolvem outros trade-offs.*
