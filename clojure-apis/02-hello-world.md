# Hello World e primeiros passos em Clojure

Primeiro projeto e REPL: sintaxe básica e como rodar código.

---

## Projeto mínimo com Clojure CLI

Crie um diretório e um arquivo de configuração de “deps” (dependências):

```bash
mkdir meu-app && cd meu-app
```

Crie `deps.edn` na raiz:

```clojure
{:paths ["src"]
 :deps {}}
```

Crie o namespace em `src/meu_app/core.clj`:

```clojure
(ns meu-app.core)

(defn -main []
  (println "Hello, World!"))

;; Para rodar: clj -M -m meu-app.core
```

Execute:

```bash
clj -M -m meu-app.core
```

Saída esperada: `Hello, World!`

---

## REPL

```bash
clj
```

No REPL:

```clojure
;; Aritmética
(+ 1 2)           ;; 3
(* 3 4)           ;; 12

;; Strings
(str "Olá, " "Clojure!")
(println "Hello, World!")

;; Definir função
(defn saudacao [nome]
  (str "Olá, " nome "!"))

(saudacao "Mundo")   ;; "Olá, Mundo!"

;; Coleções
'(1 2 3)
[1 2 3]
{:a 1 :b 2}
#{1 2 3}
```

---

## Estruturas básicas

| Tipo     | Exemplo        | Observação        |
|----------|----------------|-------------------|
| Lista    | `'(1 2 3)`     | Avaliada como chamada de função se não quoted |
| Vetor    | `[1 2 3]`      | Acesso por índice O(1) |
| Map      | `{:a 1 :b 2}`  | Chaves frequentemente keywords (`:a`) |
| Set      | `#{1 2 3}`     | Sem repetição     |
| String   | `"texto"`      |                   |

---

## Referências

- [Clojure – Rationale](https://clojure.org/about/rationale)
- [Clojure – Syntax](https://clojure.org/reference/reader)
- [ClojureDocs – Quick reference](https://clojuredocs.org/quickref)
