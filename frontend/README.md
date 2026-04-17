# Frontend

Sessão sobre **interfaces web e móveis**: fundamentos (**HTML**, **CSS**, **JavaScript**), **Tailwind CSS**, ecossistemas **React**, **React Native**, **Vue**, **Angular**, **Svelte**, **Next.js**, **Flutter** e **micro frontends**. Cada capítulo foi pensado para **problemas de produção** (acessibilidade, performance, segurança, estado, SEO, builds) e não só para “hello world”.

---

## Índice

1. [Visão geral do frontend](./01-visao-geral-frontend.md)
2. [HTML](./02-html.md)
3. [CSS](./03-css.md)
4. [JavaScript](./04-javascript.md)
5. [Tailwind CSS](./05-tailwind-css.md)
6. [React — Context API, Redux, Tailwind e WebSockets](./06-react.md)
7. [React Native](./07-react-native.md)
8. [Vue.js](./08-vue.md)
9. [Angular](./09-angular.md)
10. [Svelte](./10-svelte.md)
11. [Next.js](./11-nextjs.md)
12. [Flutter](./12-flutter.md)
13. [Microfrontends — Module Federation e single-spa](./13-microfrontends.md)

---

## Ordem de leitura sugerida

| Fase | Capítulos | Objetivo |
|------|-----------|----------|
| **Base** | Visão geral → HTML → CSS → JavaScript | DOM, cascata, módulos, `fetch`, erros comuns |
| **Produtividade UI** | Tailwind → React ou Vue | Componentização e design system leve |
| **Plataforma** | Next.js (web full-stack) ou Angular (enterprise) | SSR, rotas, DI |
| **Mobile** | React Native ou Flutter | Mesmo produto noutro runtime |
| **Escala de equipas** | Microfrontends | Autonomia de deploy e custo operacional |

---

## Problemas transversais (aparecem em todo o stack)

- **LCP alto** — imagens sem `width`/`height`, hero gigante, fontes bloqueantes.
- **CLS** — anúncios ou *banners* que inserem layout depois do paint.
- **XSS** — `innerHTML` com dados do utilizador; *libraries* desatualizadas.
- **Teclado** — modais sem *focus trap*; ordem de tab ilógica.
- **i18n** — strings hardcoded; formatos de data/moeda errados por locale.

---

## Padrões avançados (onde aprofundar nos capítulos)

| Problema comum | Padrão “inteligente” | Capítulo |
|----------------|----------------------|----------|
| UI bloqueada por JS pesado | `scheduler.postTask`, Web Workers, *islands* | [JavaScript](./04-javascript.md), [Visão geral](./01-visao-geral-frontend.md) |
| Pesquisa lenta enquanto escreve | `useDeferredValue` + `startTransition`, debounce com *leading edge* | [React](./06-react.md), [JavaScript](./04-javascript.md) |
| Estado assíncrono duplicado / *race* | TanStack Query *staleTime*, chave de query estável | [React](./06-react.md) |
| Reatividade “mágica” difícil de auditar (Svelte) | **Runes** (`$state` / `$derived`) + *snippets* para composição | [Svelte](./10-svelte.md) |
| Formulários / mutações sem validação no servidor | **Server Actions** + Zod + rate limit / idempotência | [Next.js](./11-nextjs.md) |
| *Fetch* duplicado na árvore RSC | React **`cache()`** por *request*; segment `revalidate` explícito | [Next.js](./11-nextjs.md) |
| *Parsing* JSON pesado na *main thread* (mobile) | **`compute`** + *isolate* | [Flutter](./12-flutter.md) |
| Microfrontends com *version skew* | `buildId` no shell + reload quando remotes desalinhados | [Microfrontends](./13-microfrontends.md) |
| *Federation* lenta em monorepo | Rspack / Vite MF; *shared* singleton alinhado no CI | [Microfrontends](./13-microfrontends.md) |
| Listas enormes no mobile | virtualização (`FlashList`), *windowing* | [React Native](./07-react-native.md) |

---

## Estudos relacionados

- [Node.js](../nodejs/README.md) — runtime, npm, bundlers no ecossistema JS.
- [Princípios e protocolos de APIs](../apis-arquitetura/README.md) — HTTP, REST, WebSockets, CORS em teoria.
- [Mensageria](../mensageria/README.md) — tempo real além do browser (filas, Kafka).

---

## Referências gerais (curadoria)

| Recurso | Uso |
|---------|-----|
| [MDN Web Docs](https://developer.mozilla.org/) | Referência normativa HTML/CSS/JS |
| [web.dev](https://web.dev/) | Performance, Core Web Vitals, PWA |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Acessibilidade legal/compliance |
| [OWASP — XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | Segurança no cliente |
| [Can I use](https://caniuse.com/) | Suporte de APIs e CSS |
| [Baseline](https://web.dev/baseline) | Conjunto estável de funcionalidades web |
| [Patterns.dev](https://www.patterns.dev/) | Padrões modernos (rendering, performance) |
| [web.dev — Learn Performance](https://web.dev/learn/performance/) | INP, long tasks, workers |

---

*Frameworks mudam; **contratos HTTP**, **acessibilidade** e **métricas reais de utilizador** não.*
