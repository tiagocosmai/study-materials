# Consumindo APIs REST externas

Como chamar APIs REST de outras aplicações usando **clj-http** (cliente HTTP).

---

## Dependência (deps.edn)

```clojure
{:paths ["src"]
 :deps {org.clojure/clojure {:mvn/version "1.11.1"}
        clj-http/clj-http {:mvn/version "3.12.3"}}}
```

---

## GET simples

```clojure
(require '[clj-http.client :as http])

;; GET texto
(http/get "https://api.github.com")

;; GET com parse de JSON (cheetah ou clojure.data.json)
(require '[cheshire.core :as json])
(let [resp (http/get "https://api.github.com/users/clojure")]
  (json/parse-string (:body resp) keyword))
```

Para **JSON** é comum usar **cheshire**:

```clojure
com.fasterxml.jackson.core/jackson-core {:mvn/version "2.15.2"}
cheshire/cheshire {:mvn/version "5.11.0"}
```

---

## GET com query params e headers

```clojure
(http/get "https://api.example.com/items"
  {:query-params {:page 1 :limit 10}
   :headers     {"Authorization" "Bearer TOKEN"
                 "Accept" "application/json"}
   :as          :json})  ;; :body já vem como estrutura Clojure
```

---

## POST com JSON

```clojure
(http/post "https://api.example.com/items"
  {:content-type :json
   :body         (json/generate-string {:nome "Item" :valor 100})
   :as           :json})
```

Ou com form params:

```clojure
(http/post "https://api.example.com/login"
  {:form-params {:user "admin" :password "secret"}
   :as          :json})
```

---

## Tratamento de erros e timeouts

```clojure
(try
  (http/get "https://api.example.com/data"
    {:socket-timeout 5000
     :conn-timeout  5000})
  (catch Exception e
    (println "Erro:" (.getMessage e))
    nil))
```

---

## Exemplo completo: buscar e usar dados

```clojure
(ns api.client
  (:require [clj-http.client :as http]
            [cheshire.core :as json]))

(defn buscar-usuario [username]
  (let [url (str "https://api.github.com/users/" username)
        {:keys [status body]} (http/get url {:as :json})]
    (when (= 200 status)
      body)))

(comment
  (buscar-usuario "clojure"))
```

---

## Referências

- [clj-http – README](https://github.com/dakrone/clj-http)
- [Cheshire (JSON)](https://github.com/dakrone/cheshire)
