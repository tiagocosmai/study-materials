# Clojure e IA

**Clojure** na JVM permite integrar ecossistema **Java** (clientes HTTP, JDBC, Kafka) com programação **funcional** e **REPL** rápida — útil para *glue* entre serviços, *workers* de *embedding*, ou **APIs** que orquestram chamadas a modelos.

---

## Por que considerar Clojure para camadas de orquestração

- **Interop Java** direto: chamar **LangChain4j**, **Apache HttpClient**, SDKs oficiais se existirem em Java.
- **Imutabilidade** por defeito simplifica fluxos sem efeitos acidentais entre *threads*.
- **REPL-driven** desenvolvimento para afinar prompts e transforms de dados ao vivo.

---

## LangChain4j (JVM)

Biblioteca **Java** que traz padrões de cadeias, agentes e RAG na JVM — consumível **em Clojure** como qualquer biblioteca Java.

Esboço de interop (conceitual — dependências e APIs no artefacto atual):

```clojure
;; deps: org.babashka/... ou lein/deps.edn com langchain4j-*

(import '[dev.langchain4j.model.openai OpenAiChatModel])

(def model
  (-> (OpenAiChatModel/builder)
      (.apiKey (System/getenv "OPENAI_API_KEY"))
      (.modelName "gpt-4o-mini")
      .build))

;; (.generate model "Explica RAG numa frase.")
```

*(Ver documentação atual em [LangChain4j](https://github.com/langchain4j/langchain4j) para builders e pacotes Maven.)*

---

## Chamada HTTP direta

Para APIs **OpenAI-compatible**, `clj-http` ou `babashka.curl` bastam para PoCs:

```clojure
(require '[clj-http.client :as http]
         '[cheshire.core :as json])

(defn chat [messages]
  (-> (http/post "https://api.openai.com/v1/chat/completions"
       {:headers {"Authorization" (str "Bearer " (System/getenv "OPENAI_API_KEY"))
                  "Content-Type" "application/json"}
        :body (json/generate-string
               {:model "gpt-4o-mini"
                :messages messages})})
      :body
      (json/parse-string true)))
```

---

## ClojureScript no browser

Possível usar APIs web (*fetch*) para inferência **no cliente** — atenção a **expôr chaves**: preferir **proxy no servidor** ou sessões temporárias.

---

## Bibliotecas e comunidade

- **[libpython-clj](https://github.com/clj-python/libpython-clj)** — interop com Python para reutilizar **numpy**, **torch** ou scripts de fine-tuning sem reescrever tudo em JVM.

---

## Referências

- [Clojure — Official site](https://clojure.org/)
- [LangChain4j](https://docs.langchain4j.dev/)
- [libpython-clj](https://github.com/clj-python/libpython-clj)

Para o mesmo tipo de exemplos (**SDK**, **HTTP**, **LangChain**) em **Python**, **Node.js** e **Java** nativos, vê [Exemplos práticos — Python, Node.js e Java](./07-exemplos-praticos-python-node-java.md).

---

*Clojure não é “o caminho mais curto” para notebooks de *deep learning*; brilha em **serviços estáveis** que combinam modelo + domínio + infra.*
