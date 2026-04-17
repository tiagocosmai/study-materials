# LLM e SLM

**LLM** (*Large Language Model*) — modelo de grande escala (milhões/mil milhões de parâmetros), forte em generalização e instruções, mas mais **caro** em GPU/RAM e latência.

**SLM** (*Small Language Model*) — modelo menor, mais barato de **correr localmente** ou em *edge*, com menos conhecimento “de mundo”; pode compensar com **RAG** forte ou **fine-tuning** no domínio.

---

## Comparativo rápido

| Aspeto | LLM típico | SLM típico |
|--------|------------|------------|
| **Custo inferência** | Mais alto | Mais baixo |
| **Privacidade** | Cloud ou GPU grande | Laptop / servidor modesto |
| **Seguir instruções complexas** | Melhor | Exige prompts *simples* e poucas voltas |
| **Latência** | Variável | Frequentemente menor por batch local |

---

## Modelos open-weight populares (referência, não lista exaustiva)

- Famílias **Llama**, **Mistral**, **Phi**, **Gemma**, **Qwen** — ver licenças e uso comercial caso a caso.
- Servir com **Ollama**, **vLLM**, **llama.cpp**, **text-generation-inference** conforme hardware.

---

## Quando preferir SLM

- **PII** não pode sair da rede corporativa.
- Classificação, extração estruturada **simples**, resumo com contexto já curado.
- Muitos pedidos por segundo — cluster de SLMs pode custar menos que um único LLM gigante na cloud.

---

## Quantização e hardware

**INT8 / INT4** reduz memória com pequena perda de qualidade — essencial para SLMs em GPU de consumo. Mede **tokens/s** e **latência p95**, não só acurácia pontual.

---

## Risco de “SLM demasiado pequeno”

Tarefas com muitos *edge cases* ou raciocínio multi-passo podem exigir **LLM** ou **pipeline híbrido**: SLM para triagem + LLM só quando o classificador assinala incerteza.

---

## Referências

- [Hugging Face — Models](https://huggingface.co/models)
- [Ollama](https://ollama.com/)
- [vLLM — throughput serving](https://docs.vllm.ai/)

---

*Escolha de modelo = **qualidade**, **custo**, **latência**, **compliance** — não “o maior que couber no orçamento de API”.*
