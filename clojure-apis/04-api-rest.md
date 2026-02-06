# API REST com Clojure

Como expor uma API REST em Clojure usando **Ring** (servidor HTTP) e **Compojure** (rotas).

---

## Dependências (deps.edn)

```clojure
{:paths ["src"]
 :deps {org.clojure/clojure {:mvn/version "1.11.1"}
        ring/ring-core       {:mvn/version "1.10.0"}
        ring/ring-jetty-adapter {:mvn/version "1.10.0"}
        compojure/compojure   {:mvn/version "1.7.0"}
        ring/ring-json        {:mvn/version "0.5.1"}}}
```

---

## Handler e rotas mínimos

`src/api/core.clj`:

```clojure
(ns api.core
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.json :as json]
            [compojure.core :refer [defroutes GET POST]]
            [compojure.route :as route]))

(defroutes app
  (GET "/" []
    {:status 200
     :body   {:message "API Clojure ok"}})
  (GET "/hello/:name" [name]
    {:status 200
     :body   {:message (str "Olá, " name "!")}})
  (POST "/echo" {body :body}
    {:status 200
     :body   body})
  (route/not-found {:status 404
                    :body   {:error "Não encontrado"}}))

(defn -main []
  (jetty/run-jetty (json/wrap-json-response (json/wrap-json-body app))
                   {:port 3000}))
```

Execute:

```bash
clj -M -m api.core
```

Teste: `curl http://localhost:3000/` e `curl http://localhost:3000/hello/Mundo`.

---

## Estrutura de uma resposta Ring

Um handler retorna um **map** com:

- `:status` – código HTTP (200, 201, 404, 500…)
- `:headers` – map opcional de cabeçalhos
- `:body` – corpo (string, map para JSON com middleware, etc.)

Exemplo com headers:

```clojure
(GET "/custom" []
  {:status  200
   :headers {"X-Custom" "valor"}
   :body    {:data "ok"}})
```

---

## Middleware útil

- `wrap-json-response` – converte `:body` map em JSON e define `Content-Type`
- `wrap-json-body` – parseia corpo JSON da requisição em `:body`
- `wrap-cors` – CORS (adicione a dependência `ring-cors` se precisar)

---

## Referências

- [Ring – Concepts](https://github.com/ring-clojure/ring/wiki/Concepts)
- [Compojure – README](https://github.com/weavejester/compojure)
- [Ring – Middleware](https://github.com/ring-clojure/ring/wiki/Middleware)
