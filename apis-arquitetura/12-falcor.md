# Falcor — grafo JSON e dados como caminho

## Introdução

**Falcor** (Netflix) é uma **biblioteca JavaScript** que modela dados como um **grafo JSON** endereçável por **paths** (similar a “chaves” aninhadas). O cliente pede vários caminhos em uma única requisição; o **router** no servidor resolve e devolve um **JSON Graph** — útil para UIs que precisam de **muitos recursos relacionados** sem múltiplos round-trips manuais.

```mermaid
flowchart LR
  C[Cliente Falcor] -->|paths batch| R[Router]
  R --> DS[DataSources]
  DS --> API[Backend / cache]
```

---

## JSON Graph e paths

Em vez de duplicar objetos, o grafo **normaliza** por ID e usa **refs**:

```json
{
  "usersById": {
    "1": { "name": "Ada", "orders": { "$type": "ref", "value": ["ordersById", "10"] } }
  },
  "ordersById": {
    "10": { "total": 99.5 }
  }
}
```

Consultas pedem **paths** como `["usersById", "1", "name"]` ou `["usersById", "1", "orders", "total"]`.

---

## Modelo mental vs GraphQL

| Falcor | GraphQL |
|--------|---------|
| Paths e JSON Graph | Schema tipado e linguagem de query |
| Foco em agregação de dados para UI | Ecossistema amplo multiplataforma |
| Menos adotado fora do ecossistema Netflix legado | Padrão de mercado atual |

Para projetos novos, **GraphQL** ou **BFF REST** costumam ter mais suporte comunitário; Falcor é **estudo valioso** para entender **normalização** e **batching** no cliente.

---

## Exemplo — router (Node, conceito)

```javascript
const Router = require("falcor-router");

new Router([
  {
    route: "usersById[{integers:ids}].name",
    get(pathSet) {
      return pathSet.ids.map((id) => ({
        path: ["usersById", id, "name"],
        value: "User " + id,
      }));
    },
  },
]);
```

### Java / C# / Python

Não há runtime servidor “oficial” equivalente ao **falcor-router** em JVM/.NET/Python no mesmo nível de adoção; integrações costumam ser **Node** na borda ou **proxy** que traduz paths para APIs internas. Por isso os exemplos multi-linguagem aqui focam em **consumir** princípios (batch, grafo normalizado) nas suas stacks:

### C# — batch de IDs (espírito Falcor)

```csharp
public async Task<Dictionary<string, UserDto>> GetUsersByIdAsync(IEnumerable<string> ids, CancellationToken ct)
{
    var list = ids.Distinct().ToList();
    return await _db.Users.Where(u => list.Contains(u.Id)).ToDictionaryAsync(u => u.Id, ct);
}
```

### Java — `Map` de resultados por path key

```java
public Map<String, UserView> batchUsers(Set<String> ids) {
  return userRepository.findAllById(ids).stream()
      .collect(Collectors.toMap(User::getId, UserView::from));
}
```

### Python

```python
def batch_users(ids: list[str]) -> dict[str, dict]:
    unique = list(dict.fromkeys(ids))
    rows = db.fetch_many("SELECT * FROM users WHERE id = ANY(%s)", (unique,))
    return {r["id"]: r for r in rows}
```

---

## Cache e invalidação

Falcor integra com **Model** no cliente com cache por path — mudanças exigem **invalidação** coerente. O mesmo problema aparece em **React Query / RTK Query** com chaves compostas.

---

## Referências

- Netflix Falcor — repositório e documentação no GitHub.
- Comparações com GraphQL em artigos da Netflix (eng blog).

---

*Falcor ensina **pensar em grafo normalizado**; na prática atual, avalie GraphQL, BFF ou REST + batch endpoints.*
