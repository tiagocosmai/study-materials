# Engenharia de prompts

**Engenharia de prompts** é desenhar entradas (e contexto) para um modelo gerar **saídas úteis, repetíveis e auditáveis** — não é “magia”: é comunicação estruturada + métricas.

---

## Blocos típicos de um bom prompt de sistema

1. **Papel** — Quem o modelo deve “fazer de conta” que é (analista, revisor, tradutor técnico).
2. **Formato de saída** — JSON schema, bullets, markdown, código só em *fenced blocks*.
3. **Regras duras** — “Nunca inventes números”; “Se não souberes, diz explicitamente”; “Cita apenas o texto fornecido”.
4. **Contexto** (`RAG`) — Documentos retrieved; instruções para **citá-los** vs generalizar.

### Exemplo — extrator JSON (pseudo-especificação)

```
És um extrator de dados. Devolve APENAS um objeto JSON válido com as chaves:
invoice_id (string|null), total (number|null), currency (string ISO 4217|null).
Se um campo não existir no texto, usa null. Não adiciones comentários fora do JSON.
```

---

## Few-shot vs zero-shot

| Abordagem | Quando usar |
|-----------|-------------|
| **Zero-shot** | Instruções claras bastam; modelo forte; custo/token baixo |
| **Few-shot** | Formato específico, estilo corporativo, ou modelo mais pequeno |

**Few-shot:** 2–6 exemplos de *entrada → saída desejada* reduzem ambiguidade mais do que parágrafos extra de explicação.

---

## Chain-of-thought (*CoT*) com moderação

Pedir **“passo a passo antes da resposta final”** pode melhorar raciocínio em tarefas lógicas, mas aumenta tokens e pode **vazar** raciocínio intermediário ao utilizador — em produção, usa **template interno** ou modelo que suporte raciocínio oculto conforme produto.

---

## RAG — relembrar onde o modelo “mente” menos

Sem documentos atualizados, o modelo pode **confabular**. **Retrieval-Augmented Generation** injeta trechos recuperados e instrui: “Responde só com base nos trechos; se faltar informação, diz-o.”

---

## Avaliação (*evals*)

- **Golden set:** pares pergunta/resposta esperada ou critérios de scoring.
- **LLM-as-judge:** segundo modelo avalia critérios (com viés próprio — usar com cuidado).
- **Regressão:** mesmo prompt + dataset após mudança de modelo ou template.

---

## Referências

- [OpenAI — Prompt engineering guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic — Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Google — Prompt design](https://ai.google.dev/docs/prompt_intro)

---

*Prompts são **contratos fracos** até versionares (Git), testares (*evals*) e limitares saída (schema, ferramentas).*
