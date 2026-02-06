# Acesso a banco de dados com Clojure

Conexão e consultas usando **next.jdbc** (JDBC moderno para Clojure). Para SQL em arquivos separados, use **HugSQL**.

---

## Dependências (deps.edn)

```clojure
{:paths ["src"]
 :deps {org.clojure/clojure {:mvn/version "1.11.1"}
        com.github.seancorfield/next.jdbc {:mvn/version "1.3.909"}
        org.postgresql/postgresql {:mvn/version "42.6.0"}}}
```

Para **H2** (banco em memória para testes):

```clojure
com.h2database/h2 {:mvn/version "2.2.224"}
```

---

## Conexão com next.jdbc

```clojure
(ns db.core
  (:require [next.jdbc :as jdbc]
            [next.jdbc.result-set :as rs]))

;; PostgreSQL
(def db {:dbtype "postgresql"
         :dbname "meubanco"
         :user "user"
         :password "senha"
         :host "localhost"
         :port 5432})

;; H2 em memória (exemplo)
(def db {:dbtype "h2" :dbname "mem:test"})

(def ds (jdbc/get-datasource db))
```

---

## Consultas

```clojure
;; Query que retorna todas as linhas como maps
(jdbc/execute! ds ["SELECT * FROM usuarios"])
(jdbc/execute! ds ["SELECT * FROM usuarios WHERE id = ?" 1])

;; Uma única linha
(jdbc/execute-one! ds ["SELECT * FROM usuarios WHERE id = ?" 1])

;; Com opções: retornar keys como keyword
(jdbc/execute! ds ["SELECT * FROM usuarios"]
  {:builder-fn rs/as-maps
   :key-fn    keyword})
```

---

## Inserir, atualizar, deletar

```clojure
;; Insert (retorna keys geradas se suportado)
(jdbc/execute! ds
  ["INSERT INTO usuarios (nome, email) VALUES (?, ?)" "João" "j@x.com"]
  {:return-keys true})

;; Update
(jdbc/execute! ds
  ["UPDATE usuarios SET nome = ? WHERE id = ?" "João Silva" 1])

;; Delete
(jdbc/execute! ds ["DELETE FROM usuarios WHERE id = ?" 1])
```

---

## Transações

```clojure
(jdbc/with-transaction [tx ds]
  (jdbc/execute! tx ["INSERT INTO ..."])
  (jdbc/execute! tx ["UPDATE ..."])
  ;; commit implícito ao final; exceção faz rollback
  )
```

---

## HugSQL (SQL em arquivos)

Dependência:

```clojure
com.layerware/hugsql {:mvn/version "0.5.3"}
```

Arquivo `resources/sql/usuarios.sql`:

```sql
-- :name listar-usuarios :?
SELECT * FROM usuarios;

-- :name usuario-por-id :? :1
SELECT * FROM usuarios WHERE id = :id;

-- :name inserir-usuario! :! :n
INSERT INTO usuarios (nome, email) VALUES (:nome, :email);
```

Uso em Clojure:

```clojure
(require '[hugsql.core :as hugsql])
(hugsql/def-db-fns "sql/usuarios.sql")

(listar-usuarios ds)
(usuario-por-id ds {:id 1})
(inserir-usuario! ds {:nome "João" :email "j@x.com"})
```

---

## Referências

- [next.jdbc – Getting started](https://cljdoc.org/d/com.github.seancorfield/next.jdbc/CURRENT/doc/getting-started)
- [HugSQL – Documentation](https://www.hugsql.org/)
- [PostgreSQL JDBC](https://jdbc.postgresql.org/)
