# Integração e testes regressivos

**Integração** = prova que **peças reais** (porta HTTP, driver de BD, fila) cooperam. **Regressão** = reexecutar a suíte que protege comportamento já entregue.

---

## Python — API com `httpx` + app em memória (FastAPI exemplo)

```python
# app.py
from fastapi import FastAPI
app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}
```

```python
# test_integration.py
from fastapi.testclient import TestClient
from app import app

def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
```

**BD real em Docker:** biblioteca popular — **Testcontainers** (`testcontainers-python`) para Postgres, Kafka, etc.

```python
# Esboço conceitual — requer Docker em CI
from testcontainers.postgres import PostgresContainer

def test_repo_roundtrip():
    with PostgresContainer("postgres:16") as pg:
        url = pg.get_connection_url()
        # configurar SQLAlchemy/engine com url e correr migrações + asserts
        assert url.startswith("postgresql://")
```

---

## Node.js — `supertest` + Express

```bash
npm i -D supertest jest
```

```javascript
// server.js
import express from 'express';
export function makeApp() {
  const app = express();
  app.use(express.json());
  app.post('/echo', (req, res) => res.json({ out: req.body.in }));
  return app;
}
```

```javascript
// server.test.js
import request from 'supertest';
import { makeApp } from './server.js';

const app = makeApp();

test('echo', async () => {
  const r = await request(app).post('/echo').send({ in: 'hello' }).expect(200);
  expect(r.body).toEqual({ out: 'hello' });
});
```

**Testcontainers** existe para Node (`testcontainers`) — padrão análogo ao Python.

---

## Java — Spring Boot `MockMvc` ou `WebTestClient`

Teste de *slice* web sem subir porta (rápido):

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class HealthIT {

  @Autowired MockMvc mvc;

  @Test
  void health() throws Exception {
    mvc.perform(get("/actuator/health"))
        .andExpect(status().isOk());
  }
}
```

**Testcontainers para Java:** `org.testcontainers:junit-jupiter` + `postgresql` ou `mysql` como dependência de teste.

---

## Estratégia regressiva no CI

1. **Primeiro:** testes marcados `@smoke` ou ficheiros `*.smoke.test.js` — falham em menos de dois minutos.
2. **Depois:** suíte completa unit + integração.
3. **Nightly ou pós-merge:** E2E pesado, testes visuais, cargas leves.

**Quarentena:** testes instáveis (*flaky*) não devem bloquear *main* indefinidamente — mover para quarentena com *issue* de correção.

---

## Tagging — exemplos

| Stack | Como marcar |
|-------|-------------|
| pytest | `@pytest.mark.smoke` + `pytest -m smoke` |
| Jest | `test.skip` / projetos separados ou `testPathPattern` |
| JUnit 5 | `@Tag("smoke")` + Gradle `includeTags 'smoke'` |

---

## Referências

- [FastAPI — Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [supertest](https://github.com/ladjs/supertest)
- [Spring — Testing](https://spring.io/guides/gs/testing-web/)
- [Testcontainers](https://testcontainers.com/)

---

*Integração custa mais que unitário — gaste esse custo onde o risco é real (SQL, serialização, terceiros), não em re-testar pura álgebra já coberta.*
