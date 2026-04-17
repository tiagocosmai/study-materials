# Como contribuir e citar

## Contribuir

Documentações em constante evolução. Sugestões e contribuições são bem-vindas.

- **Sugestões**: abra uma [issue](https://github.com/tiagocosmai/study-materials/issues) descrevendo a ideia ou correção.
- **Pull requests**: envie melhorias em texto, exemplos ou estrutura seguindo o padrão do repositório (Markdown, pasta por estudo, referências ao final).
- **Novo estudo**: crie um diretório com `README.md` e capítulos; depois inclua o estudo em `docs/config.json` **e regenere o índice** da raiz do repositório (secção logo abaixo).

### Índice detalhado no `README.md`

O `README.md` principal lista cada sessão com links para o **README da pasta** e para **cada capítulo**. Essa lista é gerada a partir de `docs/config.json` pelo script [`scripts/generate_readme_index.py`](./scripts/generate_readme_index.py).

**Recomendado** — a partir da **raiz** do repositório (a pasta que contém `docs/` e `README.md`):

```bash
cd study-materials
python3 scripts/generate_readme_index.py --write
```

Isto substitui automaticamente o conteúdo **entre** `<!-- INDEX_START -->` e `<!-- INDEX_END -->` no `README.md`.

**Alternativa** (só impressão no terminal, sem alterar ficheiros):

```bash
python3 scripts/generate_readme_index.py
```

Se aparecer *“não encontrei `docs/config.json`”*, o diretório atual não é a raiz do repositório: entra em `study-materials` (ou o nome da pasta do clone) e volta a correr o comando.

Atualiza também o dicionário `DESCRIPTIONS` no mesmo script se precisares de uma **descrição** nova para uma sessão.

## Citar este repositório

Ao usar ou referenciar este material:

- **Autor:** Tiago Cosmai  
- **Repositório:** https://github.com/tiagocosmai/study-materials  
- **Licença (documentação):** CC BY 4.0 — consulte `LICENSE-docs`  
- **Licença (código):** MIT — consulte `LICENSE-code`
