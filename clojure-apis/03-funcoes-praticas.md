# Funções e estruturas do dia a dia

Funções e padrões úteis no dia a dia em Clojure: coleções, map/filter/reduce, threading e I/O básico.

---

## Trabalhando com coleções

```clojure
;; Primeiro / último / n-ésimo
(first [1 2 3])      ;; 1
(rest [1 2 3])       ;; (2 3)
(last [1 2 3])       ;; 3
(nth [1 2 3] 1)      ;; 2

;; Map: aplicar função a cada elemento
(map inc [1 2 3])           ;; (2 3 4)
(map str [1 2 3])           ;; ("1" "2" "3")

;; Filter: manter só o que passa no predicado
(filter even? [1 2 3 4])    ;; (2 4)
(filter pos? [1 -2 3 -4])   ;; (1 3)

;; Reduce: acumular um valor
(reduce + [1 2 3 4])        ;; 10
(reduce * 1 [1 2 3 4])      ;; 24
```

---

## Threading (encadear transformações)

```clojure
(-> 1
    inc
    (* 2)
    (+ 10))
;; => 14

(->> [1 2 3 4]
     (filter even?)
     (map inc)
     (reduce +))
;; => 8  (2+1 + 4+1 = 3+5)
```

---

## Maps: obter, associar, atualizar

```clojure
(def pessoa {:nome "João" :idade 30 :cidade "SP"})

(get pessoa :nome)           ;; "João"
(:nome pessoa)               ;; "João" (keyword como função)
(:inexistente pessoa "N/A")   ;; "N/A" (valor default)

(assoc pessoa :email "j@x.com")
(assoc pessoa :idade 31)
(dissoc pessoa :cidade)
(update pessoa :idade inc)
(merge {:a 1} {:b 2})       ;; {:a 1 :b 2}
```

---

## I/O básico

```clojure
;; Ler linha do stdin
(read-line)

;; Ler arquivo inteiro como string
(slurp "arquivo.txt")

;; Escrever em arquivo
(spit "saida.txt" "conteúdo")

;; Anexar
(spit "log.txt" "linha\n" :append true)
```

---

## Tratamento de erros

```clojure
(try
  (/ 1 0)
  (catch ArithmeticException e
    (println "Divisão por zero")
    nil)
  (finally
    (println "Sempre executa")))
```

---

## Referências

- [Clojure – Collections](https://clojure.org/reference/data_structures)
- [Clojure – Sequences](https://clojure.org/reference/sequences)
- [ClojureDocs – map, filter, reduce](https://clojuredocs.org/quickref)
