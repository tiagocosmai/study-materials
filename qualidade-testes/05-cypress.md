# Cypress

**Cypress** é popular em equipas **JavaScript/TypeScript**: corre **dentro do browser** (arquitetura própria), com **time-travel debugging** e excelente DX. O *runner* oficial é Node; não há “Cypress SDK” nativo em Python/Java como primeira classe — integrações costumam ser **Cypress CLI + subprocess** ou **API de resultados**.

---

## Instalação (Node)

```bash
npm i -D cypress
npx cypress open   # modo interativo
npx cypress run    # headless CI
```

`cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
```

---

## Exemplo — teste E2E

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout', () => {
  beforeEach(() => {
    cy.visit('/cart');
  });

  it('shows empty state', () => {
    cy.contains('Your cart is empty').should('be.visible');
  });

  it('adds item via API then sees UI', () => {
    cy.request('POST', '/api/cart', { sku: 'BOOK-1', qty: 1 }).then((res) => {
      expect(res.status).to.eq(200);
    });
    cy.reload();
    cy.get('[data-testid="line-item"]').should('have.length', 1);
  });
});
```

**Comandos customizados** (`cypress/support/commands.ts`):

```typescript
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/app');
  });
});
```

Uso: `cy.login('u@test.com', 'secret')`.

---

## Exemplo — interceptar rede (*stub*)

```typescript
it('handles API error', () => {
  cy.intercept('GET', '/api/profile', { statusCode: 500 }).as('profile');
  cy.visit('/me');
  cy.wait('@profile');
  cy.contains('Something went wrong').should('exist');
});
```

---

## Component Testing (alternativa a Storybook + test runner)

Cypress pode montar componentes React/Vue **isolados** (`@cypress/react` etc.) — útil para regressão de UI sem subir servidor completo.

---

## Python ou Java como orquestrador

Padrão comum em monorepos: **pipeline** invoca `npx cypress run` após `docker compose up`. O teste continua em **JavaScript**; a linguagem do *build* é irrelevante.

---

## Playwright vs Cypress (resumo)

| Aspeto | Cypress | Playwright |
|--------|---------|------------|
| Browsers | Chrome-family principal; WebKit experimental | Chromium, Firefox, WebKit first-class |
| Arquitetura | *In-browser* runner | Processo externo controla browser |
| API multilingue | JS/TS nativo | JS, Python, Java, C# |

---

## Referências

- [Cypress — Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/app/core-concepts/best-practices)
- [cy.session](https://docs.cypress.io/api/commands/session)

---

*Evita esperas fixas `cy.wait(3000)` — prefere **assertions** que retries automáticos do Cypress ou `cy.intercept().as()` com `cy.wait('@alias')`.*
