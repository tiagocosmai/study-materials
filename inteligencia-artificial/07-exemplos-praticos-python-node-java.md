# Exemplos práticos — Python, Node.js e Java

Este capítulo espelha a ideia do [Clojure e IA](./06-clojure-e-ia.md): **SDK oficial**, **HTTP direto** (API *OpenAI-compatible*) e **abstração** (LangChain / LangChain4j). Ajusta `model` e `base_url` se usares **Ollama**, **Groq**, **Azure OpenAI**, etc.

**Pré-requisito comum:** variável de ambiente `OPENAI_API_KEY` (ou o nome que o teu fornecedor usar).

---

## Python

### Dependências típicas

```text
# requirements.txt (extrato)
openai>=1.40.0
httpx>=0.27.0
python-dotenv>=1.0.0
# Opcional LangChain:
# langchain-core langchain-openai
# Opcional Anthropic:
# anthropic>=0.34.0
```

Carregar `.env` (opcional): `from dotenv import load_dotenv; load_dotenv()`.

---

### 1 — SDK OpenAI (`openai`)

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    # Para endpoint compatível (ex.: proxy, Ollama OpenAI API):
    # base_url="http://localhost:11434/v1",
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "Respondes sempre em português europeu, conciso."},
        {"role": "user", "content": "Em uma frase: o que é um agente LLM?"},
    ],
    temperature=0.2,
)
print(response.choices[0].message.content)
```

---

### 2 — HTTP com `httpx` (sem SDK)

Útil quando queres controlo total do JSON ou um cliente já padronizado na equipa.

```python
import os
import httpx

payload = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Devolve só a palavra: OK"}],
    "temperature": 0,
}

with httpx.Client(timeout=60.0) as client:
    r = client.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    r.raise_for_status()
    data = r.json()
print(data["choices"][0]["message"]["content"])
```

---

### 3 — *Tool calling* mínimo (função descrita ao modelo)

```python
import json
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

tools = [
    {
        "type": "function",
        "function": {
            "name": "sum_two",
            "description": "Soma dois números inteiros.",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {"type": "integer"},
                    "b": {"type": "integer"},
                },
                "required": ["a", "b"],
            },
        },
    }
]

msg = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Quanto é 19 + 23? Usa a ferramenta."}],
    tools=tools,
    tool_choice="auto",
)

call = msg.choices[0].message.tool_calls[0]
args = json.loads(call.function.arguments)
result = args["a"] + args["b"]
print(result)  # 42 — em produção, o teu código valida `args` e executa regras reais.
# Se `tool_calls` vier vazio, o modelo responde só em texto — trata esse caso antes de indexar [0].
```

---

### 4 — LangChain (LCEL) — script completo

```bash
pip install langchain-core langchain-openai
```

```python
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

os.environ.setdefault("OPENAI_API_KEY", "")  # ou load_dotenv()

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "És um assistente técnico. Respostas curtas."),
        ("human", "{question}"),
    ]
)

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
chain = prompt | llm

out = chain.invoke({"question": "Define RAG numa frase."})
print(out.content)
```

---

### 5 — Anthropic (SDK `anthropic`) — opcional

```bash
pip install anthropic
```

```python
import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
msg = client.messages.create(
    model="claude-3-5-haiku-20241022",
    max_tokens=256,
    messages=[{"role": "user", "content": "Diz olá em português."}],
)
print(msg.content[0].text)
```

---

## Node.js (TypeScript / ESM)

### Dependências típicas

```bash
npm init -y
npm i openai
# Opcional TS: npm i -D typescript @types/node && npx tsc --init
```

Define em `package.json`: `"type": "module"` se usares `import`.

---

### 1 — SDK `openai`

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const res = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Respondes em português europeu.' },
    { role: 'user', content: 'Resume o que é um token LLM numa linha.' },
  ],
  temperature: 0.2,
});

console.log(res.choices[0].message.content);
```

`baseURL` opcional para API compatível:

```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'http://localhost:11434/v1',
});
```

---

### 2 — `fetch` nativo (sem instalar SDK)

```javascript
const body = {
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Responde só: OK' }],
  temperature: 0,
};

const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
console.log(data.choices[0].message.content);
```

---

### 3 — LangChain.js (cadeia mínima)

```bash
npm i @langchain/core @langchain/openai
```

```javascript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'Respondes em português europeu, de forma breve.'],
  ['human', '{question}'],
]);

const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0.1 });
const chain = prompt.pipe(llm);

const out = await chain.invoke({ question: 'Define chain-of-thought numa frase.' });
console.log(out.content);
```

Documentação: [LangChain.js](https://js.langchain.com/).

---

### 4 — *Streaming* (leitura incremental da resposta)

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Conta até 5, um número por linha.' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
process.stdout.write('\n');
```

---

### 5 — Ferramentas (*tools*) com SDK

```javascript
import OpenAI from 'openai';

const openai = new OpenAI();

const tools = [
  {
    type: 'function',
    function: {
      name: 'weather_stub',
      description: 'Devolve tempo fixo para demonstração.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' },
        },
        required: ['city'],
      },
    },
  },
];

const first = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Qual o tempo em Lisboa? Usa a função.' }],
  tools,
  tool_choice: 'auto',
});

const tc = first.choices[0].message.tool_calls?.[0];
console.log('Tool:', tc.function.name, JSON.parse(tc.function.arguments));
// O teu serviço executaria a ferramenta real e faria segunda chamada com role: tool.
```

---

## Java (JDK 11+)

### 1 — LangChain4j (Maven)

Usa o módulo `langchain4j-open-ai` — vê [versão atual](https://central.sonatype.com/artifact/dev.langchain4j/langchain4j-open-ai) ou o BOM `langchain4j-bom`.

```xml
<dependency>
  <groupId>dev.langchain4j</groupId>
  <artifactId>langchain4j-open-ai</artifactId>
  <version>1.13.0</version>
</dependency>
```

Na série **1.x**, o modelo de chat implementa `ChatModel` e expõe `chat(String)`:

```java
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

public class DemoL4j {
  public static void main(String[] args) {
    ChatModel model = OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .modelName("gpt-4o-mini")
        .temperature(0.2)
        .build();

    String reply = model.chat("Em uma frase: o que é embedding?");
    System.out.println(reply);
  }
}
```

Para **Azure OpenAI** ou URL *OpenAI-compatible*, usa `.baseUrl("https://...")` no builder (como na [documentação OpenAI do LangChain4j](https://docs.langchain4j.dev/integrations/language-models/open-ai)).

---

### 2 — `java.net.http.HttpClient` (sem LangChain4j)

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class OpenAiRaw {
  public static void main(String[] args) throws Exception {
    String key = System.getenv("OPENAI_API_KEY");
    String body = """
        {
          "model": "gpt-4o-mini",
          "messages": [{"role": "user", "content": "Responde s\\u00f3: OK"}],
          "temperature": 0
        }
        """;

    HttpRequest req = HttpRequest.newBuilder()
        .uri(URI.create("https://api.openai.com/v1/chat/completions"))
        .timeout(Duration.ofSeconds(60))
        .header("Authorization", "Bearer " + key)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();

    HttpClient client = HttpClient.newHttpClient();
    HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
    System.out.println(res.statusCode());
    System.out.println(res.body());
    // Em produção: parsear JSON com Jackson / Gson e tratar erros.
  }
}
```

---

### 3 — Ferramentas com LangChain4j (ideia)

Usa `ToolSpecification` + `AiServices` ou o *low-level* `ChatLanguageModel` com mensagens que incluem *tool calls* — vê exemplos na [documentação de *Tools*](https://docs.langchain4j.dev/). O fluxo é o mesmo que em Python/Node: descreves funções → modelo devolve chamada → o teu código executa → devolves resultado como mensagem `tool`.

---

## Tabela comparativa rápida

| Objetivo | Python | Node | Java |
|----------|--------|------|------|
| Produção rápida | `openai` SDK | `openai` npm | LangChain4j ou SDK HTTP do fornecedor |
| Mínimas dependências | `httpx` | `fetch` | `HttpClient` + parser JSON |
| Orquestração / RAG | LangChain | LangChain.js | LangChain4j |

---

## Referências

- [OpenAI — API reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Python SDK](https://github.com/openai/openai-python)
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- [LangChain — Python](https://python.langchain.com/)
- [LangChain.js](https://js.langchain.com/)
- [LangChain4j](https://docs.langchain4j.dev/)

---

*Valida sempre **erros HTTP**, **timeouts** e **formato JSON** antes de passares resultados a utilizadores ou a ferramentas críticas.*
