# Código limpo e legibilidade

## Princípio: código é lido mais do que escrito

Priorize **clareza** para quem vai ler (incluindo você no futuro). Nomes e estrutura devem revelar a intenção.

## Nomenclatura

- **Variáveis e funções** – Nomes que descrevem o papel ou o resultado, não o tipo.
- **Constantes** – Geralmente em UPPER_SNAKE ou PascalCase conforme a linguagem.
- **Evite** abreviações obscuras e nomes genéricos (`data`, `temp`, `x`), exceto em escopos muito curtos (ex.: índices em laços).

**Exemplo (conceitual):**

```text
Ruim:  fn calc(d, t) -> d / t
Melhor: fn calcular_velocidade(distancia_metros, tempo_segundos) -> velocidade
```

## Funções e métodos

- **Uma responsabilidade** – Cada função faz uma coisa e faz bem.
- **Curtas** – Quando possível, cabem na tela; se crescer demais, extrair subfunções.
- **Poucos parâmetros** – Muitos parâmetros indicam que a função faz demais ou que um objeto de parâmetros faria sentido.
- **Sem efeitos colaterais ocultos** – O nome e os parâmetros devem deixar claro o que a função altera.

## DRY (Don't Repeat Yourself)

Evite duplicar lógica: extraia para funções, módulos ou componentes reutilizáveis. Código duplicado multiplica bugs e esforço de manutenção.

## Estrutura e formatação

- **Indentação e estilo** – Use um guia de estilo da linguagem (ex.: PEP 8, Prettier, EditorConfig) e formatação automática.
- **Arquivos e módulos** – Organize por responsabilidade; nomes de arquivos que reflitam o conteúdo.
- **Comentários** – Prefira código autoexplicativo; use comentários para o **porquê**, não para repetir o **o quê**.

Nos estudos de [Design Patterns](../design-patterns/README.md) e [Git/commits](../README.md) você aprofunda organização e fluxo de trabalho.
