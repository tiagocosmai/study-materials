# Testes unitários — Python, Node.js e Java

Foco em **isolamento**: dependências externas substituídas por *doubles* controlados. Exemplos mínimos mas **reais** de sintaxe e idiomática.

---

## Python — `pytest`

Instalação: `pip install pytest`.

### Exemplo 1 — função pura + `parametrize`

```python
# pricing.py
def discount(total: float, pct: float) -> float:
    if total < 0 or not 0 <= pct <= 100:
        raise ValueError("invalid")
    return round(total * (1 - pct / 100), 2)
```

```python
# test_pricing.py
import pytest
from pricing import discount

@pytest.mark.parametrize(
    "total,pct,expected",
    [
        (100, 10, 90.0),
        (50, 0, 50.0),
        (200, 100, 0.0),
    ],
)
def test_discount(total, pct, expected):
    assert discount(total, pct) == expected

def test_discount_rejects_bad_input():
    with pytest.raises(ValueError):
        discount(-1, 10)
```

Correr: `pytest -q`.

### Exemplo 2 — `unittest.mock` (patch de módulo)

```python
# notifier.py
import urllib.request

def notify(url: str, body: bytes) -> int:
    req = urllib.request.Request(url, data=body, method="POST")
    with urllib.request.urlopen(req, timeout=5) as resp:
        return resp.status
```

```python
# test_notifier.py
from unittest.mock import MagicMock, patch
import notifier

@patch("notifier.urllib.request.urlopen")
def test_notify_returns_status(mock_urlopen):
    mock_cm = MagicMock()
    mock_cm.__enter__.return_value.status = 204
    mock_cm.__exit__.return_value = False
    mock_urlopen.return_value = mock_cm

    assert notifier.notify("https://api.example/hook", b"{}") == 204
```

### Exemplo 3 — *fixtures* para setup reutilizável

```python
# conftest.py
import pytest

@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Ada", "active": True}
```

```python
def test_user_active(sample_user):
    assert sample_user["active"] is True
```

Documentação: [pytest](https://docs.pytest.org/).

---

## Node.js — Jest

Instalação: `npm i -D jest` e em `package.json`: `"scripts": { "test": "jest" }`.

### Exemplo 1 — módulo puro

```javascript
// sum.js
export function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('numbers only');
  return a + b;
}
```

```javascript
// sum.test.js
import { sum } from './sum.js';

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('rejects non-numbers', () => {
    expect(() => sum('a', 1)).toThrow(TypeError);
  });
});
```

### Exemplo 2 — mock de módulo com `jest.mock`

```javascript
// orders.js
import fetch from 'node-fetch';

export async function fetchOrder(id) {
  const r = await fetch(`https://api.example/orders/${id}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
```

```javascript
// orders.test.js
jest.unstable_mockModule('node-fetch', () => ({
  default: jest.fn(),
}));
import fetch from 'node-fetch';
const { fetchOrder } = await import('./orders.js');

test('fetchOrder parses body', async () => {
  fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ id: '1', total: 99 }),
  });
  await expect(fetchOrder('1')).resolves.toEqual({ id: '1', total: 99 });
});
```

*(Em projetos CommonJS, `jest.mock('node-fetch')` no topo do ficheiro é o padrão habitual.)*

### Exemplo 3 — *timers* falsos

```javascript
jest.useFakeTimers();

test('debounced fn', () => {
  const fn = jest.fn();
  const debounced = () => setTimeout(fn, 300);
  debounced();
  jest.advanceTimersByTime(300);
  expect(fn).toHaveBeenCalled();
});
```

Documentação: [Jest](https://jestjs.io/).

---

## Java — JUnit 5 + Mockito

Dependências Maven típicas: `junit-jupiter`, `mockito-core` (scope `test`).

### Exemplo 1 — JUnit 5 básico

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

class PricingTest {

  static double discount(double total, double pct) {
    if (total < 0 || pct < 0 || pct > 100) throw new IllegalArgumentException();
    return Math.round(total * (1 - pct / 100) * 100) / 100.0;
  }

  @ParameterizedTest
  @CsvSource({"100, 10, 90.0", "50, 0, 50.0"})
  void discountParameterized(double total, double pct, double expected) {
    assertEquals(expected, discount(total, pct));
  }

  @Test
  void discountRejects() {
    assertThrows(IllegalArgumentException.class, () -> discount(-1, 10));
  }
}
```

### Exemplo 2 — Mockito: mock de interface

```java
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

interface EmailGateway {
  void send(String to, String body);
}

class WelcomeService {
  private final EmailGateway mail;
  WelcomeService(EmailGateway mail) { this.mail = mail; }
  void register(String email) {
    mail.send(email, "welcome");
  }
}

class WelcomeServiceTest {
  @Test
  void sendsWelcomeEmail() {
    EmailGateway mockMail = mock(EmailGateway.class);
    var svc = new WelcomeService(mockMail);
    svc.register("user@example.com");
    verify(mockMail).send("user@example.com", "welcome");
  }
}
```

### Exemplo 3 — `@ExtendWith(MockitoExtension.class)` e `@Mock`

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

interface PaymentClient {
  String charge(int cents);
}

class OrderService {
  private final PaymentClient payments;
  OrderService(PaymentClient payments) { this.payments = payments; }
  String checkout(int cents) {
    return payments.charge(cents);
  }
}

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock PaymentClient payments;
  @InjectMocks OrderService orders;

  @Test
  void chargesClient() {
    when(payments.charge(10)).thenReturn("tx-1");
    assertEquals("tx-1", orders.checkout(10));
  }
}
```

Documentação: [JUnit 5](https://junit.org/junit5/), [Mockito](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html).

---

## Referências cruzadas

| Tema | Python | Node | Java |
|------|--------|------|------|
| Parametrização | `@pytest.mark.parametrize` | `test.each` / loops | `@ParameterizedTest` |
| Mock de função | `unittest.mock.patch` | `jest.fn()`, `jest.mock` | `mock()`, `when()` |
| Asserções exceção | `pytest.raises` | `expect(() => ...).toThrow()` | `assertThrows` |

---

## Referências

- [pytest — fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
- [Jest — mocking modules](https://jestjs.io/docs/mock-functions)
- [JUnit 5 — User Guide](https://junit.org/junit5/docs/current/user-guide/)

---

*Unitários baratos devem falhar **só** quando a regra de negócio ou o contrato da unidade mudou — não quando alguém renomeou uma classe interna irrelevante para o comportamento.*
