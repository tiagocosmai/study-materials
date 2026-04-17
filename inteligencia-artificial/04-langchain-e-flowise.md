# LangChain e Flowise

**LangChain** é um ecossistema (principalmente **Python** e **TypeScript**) para encadear **modelos**, **prompts**, **retrieval**, **agentes** e **ferramentas**. **Flowise** é uma UI **open-source** para construir fluxos LangChain-*like* arrastando nós — bom para prototipagem e equipas menos focadas em código.

---

## LangChain — ideias centrais

| Peça | Função |
|------|--------|
| **LCEL** (*LangChain Expression Language*) | Compor cadeias com `|` (pipe) em Python — legível e testável |
| **RAG** | Loaders → split → embed → vector store → retriever → prompt |
| **Agents / Tools** | Modelo escolhe ferramentas; executor no teu processo |
| **LangGraph** | Fluxos como **grafo** com estado (ciclos, human-in-the-loop) |

### Exemplo mínimo (Python, estilo conceptual)

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages([
    ("system", "Respondes em português europeu, de forma breve."),
    ("user", "{question}"),
])
chain = prompt | ChatOpenAI(model="gpt-4o-mini")
# chain.invoke({"question": "O que é RAG?"})
```

*(Requer pacotes `langchain-core`, `langchain-openai` e variável `OPENAI_API_KEY` — ajustar ao fornecedor que uses.)*

---

## LangSmith (opcional)

Ferramenta da mesma família para **tracing**, *datasets* e *evals* — útil quando passas de PoC a produção.

---

## Flowise — para quem

| Vantagem | Limitação |
|----------|-----------|
| Velocidade de experimentação | Fluxos grandes exigem disciplina (versionar export JSON) |
| Menos código inicial | Depuração profunda pode exigir saltar para LangChain em código |

Fluxo típico: **Chat trigger** → **Retriever** (Pinecone, etc.) → **LLM Chain** → resposta.

---

## LangChain vs “só SDK do fornecedor”

- SDK **nativo** (OpenAI, Anthropic…) — menos abstração, mais controlo fino.
- **LangChain** — acelera RAG + agentes + trocar modelo; curva de API em evolução.

---

## Referências

- [LangChain — Documentation](https://python.langchain.com/)
- [LangGraph](https://langchain-ai.github.io/langgraph/)
- [Flowise](https://docs.flowiseai.com/)

**Ver também:** [Exemplos práticos — Python, Node.js e Java](./07-exemplos-praticos-python-node-java.md) — SDKs, HTTP e LangChain por *runtime*.

---

*Abstração poupa tempo; quando o produto estabiliza, parte do pipeline costuma migrar para **código direto** e *observabilidade* explícita.*
