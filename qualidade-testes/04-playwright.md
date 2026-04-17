# Playwright

**Playwright** controla Chromium, Firefox e WebKit com **uma API** estável; suporta **Python**, **Node.js**, **Java** e **C#**. Boa para E2E, *smoke* pós-deploy e testes **API + UI** no mesmo projeto.

---

## Conceitos

- **Browser** → **Context** (isolamento cookies/cache) → **Page**.
- **Auto-wait:** ações esperam elementos *actionable* (reduz *flakes* vs Selenium “naive”).
- **Trace viewer** — gravar falhas no CI para reprodução local.

---

## Node.js / TypeScript

Instalação:

```bash
npm init -y
npm i -D @playwright/test
npx playwright install
```

`playwright.config.ts` (trecho):

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
});
```

Teste exemplo:

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/My App/i);
});

test('form submit', async ({ page }) => {
  await page.goto('/contact');
  await page.getByLabel('Email').fill('a@b.com');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Thanks')).toBeVisible();
});
```

Correr: `npx playwright test`.

**API testing** (sem browser):

```typescript
import { test, expect } from '@playwright/test';

test('REST json', async ({ request }) => {
  const res = await request.get('https://catfact.ninja/fact');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toHaveProperty('fact');
});
```

---

## Python

```bash
pip install playwright
playwright install
```

```python
# test_example.py
from playwright.sync_api import sync_playwright

def test_has_title():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://playwright.dev")
        assert "Playwright" in page.title()
        browser.close()
```

Com **pytest-playwright**:

```bash
pip install pytest-playwright
playwright install
```

```python
def test_visit(page):
    page.goto("https://playwright.dev")
    assert page.locator("text=Get started").is_visible()
```

---

## Java

Maven — dependência:

```xml
<dependency>
  <groupId>com.microsoft.playwright</groupId>
  <artifactId>playwright</artifactId>
  <version>1.49.0</version>
  <scope>test</scope>
</dependency>
```

```java
import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

public class ExampleTest {
  static Playwright playwright;
  static Browser browser;

  @BeforeAll
  static void launch() {
    playwright = Playwright.create();
    browser = playwright.chromium().launch();
  }

  @AfterAll
  static void close() {
    browser.close();
    playwright.close();
  }

  @Test
  void title() {
    Page page = browser.newPage();
    page.navigate("https://playwright.dev");
    Assertions.assertTrue(page.title().contains("Playwright"));
    page.close();
  }
}
```

---

## Quando preferir Playwright

- Equipa **poliglota** (mesma ferramenta em JS back-end e QA em Java).
- Precisas de **trace**, **Codegen** (`npx playwright codegen`) e **multi-browser** simples.

## Referências

- [Playwright — Docs](https://playwright.dev/)
- [Playwright Python](https://playwright.dev/python/)
- [Playwright Java](https://playwright.dev/java/)

---

*Codegen acelera esboços; revisa sempre *locators* estáveis (`getByRole`, `data-testid`) em vez de CSS frágil.*
