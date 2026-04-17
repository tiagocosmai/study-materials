# Inteligência artificial

Sessão sobre **como desenhar, orquestrar e operar** sistemas com modelos de linguagem: **engenharia de prompts**, **agentes**, automação (**n8n**), frameworks (**LangChain**, **Flowise**), escolha entre **LLM** e **SLM**, e uso de **Clojure** no ecossistema JVM / interop.

---

## Mapa mental

```mermaid
flowchart LR
  P[Prompts claros] --> A[Agentes + ferramentas]
  A --> O[Orquestração n8n / LangChain]
  O --> M[Modelo certo LLM vs SLM]
  M --> X[Clojure quando JVM importa]
```

---

## Índice

1. [Engenharia de prompts](./01-engenharia-de-prompts.md)
2. [Construção de agentes de IA](./02-construcao-de-agentes.md)
3. [n8n](./03-n8n.md)
4. [LangChain e Flowise](./04-langchain-e-flowise.md)
5. [LLM e SLM](./05-llm-e-slm.md)
6. [Clojure e IA](./06-clojure-e-ia.md)

---

## Estudos relacionados

- [Node.js](../nodejs/README.md) — muitos SDKs de IA são **JavaScript/TypeScript**.
- [Qualidade e testes](../qualidade-testes/README.md) — regressão de *pipelines* com LLM (*evals*, *golden sets*).
- [APIs e arquitetura](../apis-arquitetura/README.md) — contratos HTTP atrás de *gateways* de modelo.

---

*Modelos são **probabilísticos**; sistema de IA em produção precisa de **contratos**, **limites** e **observabilidade**, não só de prompts bonitos.*
