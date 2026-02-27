# Programação declarativa

## Definição e contraste com imperativo

Na **programação declarativa**, o programador descreve **o quê** deve ser obtido (o resultado, as regras, a estrutura) em vez de **como** obtê-lo passo a passo. O “como” fica a cargo do runtime, do motor de banco de dados ou do framework. O código tende a ser mais curto e focado em intenção; a otimização e o fluxo de execução são responsabilidade do sistema.

Contraste rápido:

- **Imperativo:** “Percorra a lista, compare cada item com o critério, acumule os que passarem em uma nova lista e retorne.”
- **Declarativo:** “Selecione os itens que satisfazem o critério.” (SQL, ou uma expressão filter/map em linguagem de alto nível.)

Linguagens ou contextos declarativos típicos: **SQL**, **HTML**, **CSS**, **Prolog**, **configuração** (YAML, Terraform, GitHub Actions), e em parte **React** (descrever a UI para um dado estado).

---

## Quando usar

O estilo declarativo é adequado quando:

- O problema é bem **modelado** por regras, consultas ou estrutura (dados, UI, infra).
- Você quer **separar** intenção de implementação (o motor SQL ou o React decidem como executar).
- Há **reuso** de padrões (consultas, componentes, pipelines de CI) com pequenas variações.
- **Manutenção** e leitura são prioridade (menos detalhe de controle, mais expressão do objetivo).

Ele pode ser menos adequado quando é necessário controle fino de desempenho ou de ordem de execução; aí trechos imperativos ou procedural complementam.

---

## SQL: o exemplo clássico

Em SQL você declara **quais** dados quer (condições, junções, agregações); o banco escolhe índices, ordem de varredura e plano de execução.

```sql
-- “Dê-me o total de pedidos por cliente nos últimos 30 dias”
SELECT cliente_id, COUNT(*) AS total_pedidos, SUM(valor) AS total_valor
FROM pedidos
WHERE data >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY cliente_id
HAVING SUM(valor) > 1000
ORDER BY total_valor DESC;
```

Não há loops nem variáveis no SQL; há **declaração** de relações e filtros. A mesma ideia aparece em ORMs quando a API é “query builder” ou “critérios” em vez de SQL manual.

---

## HTML e UI declarativa

HTML descreve **estrutura e significado** da página, não o algoritmo de desenho. O navegador decide como renderizar.

```html
<article>
  <h1>Paradigmas de programação</h1>
  <p>Um paradigma é um modelo de como estruturar o código.</p>
  <ul>
    <li>Procedural</li>
    <li>Orientado a objetos</li>
    <li>Funcional</li>
  </ul>
</article>
```

Em React, a UI é descrita em função do **estado**: “dado este estado, esta é a árvore de elementos”. O React decide quando e como atualizar o DOM (declarativo em relação ao resultado visual).

```tsx
function Mensagem({ usuario, mensagens }) {
  return (
    <div>
      <h2>Olá, {usuario.nome}</h2>
      {mensagens.length === 0 ? (
        <p>Nenhuma mensagem.</p>
      ) : (
        <ul>
          {mensagens.map((m) => (
            <li key={m.id}>{m.texto}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Não há “pegue o elemento X e altere o texto”; há “o componente retorna esta estrutura para estes dados”.

---

## Configuração como código declarativo

Arquivos de configuração descrevem **estado desejado** (o quê), e uma ferramenta compara com o estado atual e aplica mudanças. Exemplo (GitHub Actions):

```yaml
name: CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
```

Você declara “em todo push em main, rode estes passos neste runner”; o GitHub executa. Terraform, Kubernetes manifests e Docker Compose seguem a mesma linha: descrever o que se quer, não a sequência imperativa em uma linguagem de script.

---

## C# LINQ (declarativo sobre coleções)

LINQ declara **o quê** obter (filtros, projeções, agrupamentos); o runtime escolhe como iterar:

```csharp
using System.Linq;

var resultado = pedidos
    .Where(p => p.Data >= DateTime.Now.AddDays(-30))
    .GroupBy(p => p.ClienteId)
    .Select(g => new { ClienteId = g.Key, Total = g.Sum(p => p.Valor) })
    .Where(x => x.Total > 1000)
    .OrderByDescending(x => x.Total);
```

Não há loops nem índices; há expressões que descrevem o resultado. Entity Framework traduz expressões LINQ em SQL (declarativo em dois níveis).

---

## Python (list/dict comprehensions)

Comprehensions descrevem a **estrutura resultante** em vez de passos:

```python
# “Dê-me os totais por cliente para pedidos recentes”
from datetime import datetime, timedelta
limite = datetime.now() - timedelta(days=30)
totais = {
    cid: sum(p["valor"] for p in pedidos if p["cliente_id"] == cid and p["data"] >= limite)
    for cid in {p["cliente_id"] for p in pedidos}
}
# Filtrar e ordenar (resultado declarativo)
top = sorted(
    [(k, v) for k, v in totais.items() if v > 1000],
    key=lambda x: x[1],
    reverse=True,
)
```

---

## Clojure (query-like com dados)

Em Clojure, bibliotecas como **core.logic** ou funções sobre sequências permitem estilo “consulta” declarativo:

```clojure
;; Estilo declarativo: descrever o que se quer (pedidos do cliente A, totais)
(def pedidos
  [{:id 1 :cliente "A" :valor 100}
   {:id 2 :cliente "B" :valor 250}
   {:id 3 :cliente "A" :valor 80}])
;; “Total por cliente” como expressão
(->> pedidos
     (group-by :cliente)
     (map (fn [[c itens]] [c (reduce + (map :valor itens))]))
     (into {}))
;; => {"A" 180, "B" 250}
```

A intenção é “agrupar por cliente e somar”; o “como” (reduce, map) fica na biblioteca de sequências.

---

## Declarativo vs funcional

Programação **funcional** pode ser **declarativa** quando expressa transformações (map, filter, SQL-like) em vez de loops e mutações. Nem todo código declarativo é funcional (HTML não é); e há código funcional que ainda descreve “como” (passo a passo com funções). Na prática, pipelines funcionais (Clojure, JavaScript com map/filter/reduce) e consultas SQL são exemplos em que os dois conceitos se encontram.

---

## Vantagens e desvantagens

| Vantagens | Desvantagens |
|-----------|----------------|
| Código mais curto e alinhado à intenção | Menos controle sobre ordem e detalhes de execução |
| Otimização delegada ao motor (SQL, React, Terraform) | Debug às vezes mais difícil (o “como” está no runtime) |
| Menos bugs de implementação (menos estado e fluxo manual) | Pode haver limite de expressividade (quando o motor não cobre o caso) |
| Reuso e padronização (consultas, componentes, pipelines) | Curva de aprendizado do ecossistema (SQL, React, YAML) |

---

## Resumo

Programação **declarativa** prioriza a descrição do **resultado** ou das **regras**, deixando o “como” para o ambiente de execução. SQL, HTML, React (UI em função do estado) e configuração (CI, infra) são exemplos cotidianos. Combinada com estilo funcional (transformações, imutabilidade), reduz complexidade e facilita manutenção em muitos domínios.

---

*Próximo: [Programação reativa](./07-programacao-reativa.md).*
