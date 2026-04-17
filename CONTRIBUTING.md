# Como contribuir e citar

## Contribuir

Documentações em constante evolução. Sugestões e contribuições são bem-vindas.

- **Sugestões**: abra uma [issue](https://github.com/tiagocosmai/study-materials/issues) descrevendo a ideia ou correção.
- **Pull requests**: envie melhorias em texto, exemplos ou estrutura seguindo o padrão do repositório (Markdown, pasta por estudo, referências ao final).
- **Novo estudo**: crie um diretório com `README.md` e capítulos; depois inclua o estudo em `docs/config.json` **e regenere o índice** da raiz do repositório (secção logo abaixo).

### Índice detalhado no `README.md`

O `README.md` principal lista cada sessão com links para o **README da pasta** e para **cada capítulo**. Essa lista é gerada a partir de `docs/config.json` pelo script [`scripts/generate_readme_index.py`](./scripts/generate_readme_index.py).

Depois de alterares capítulos ou sessões no `config.json`:

```bash
cd study-materials   # ou a raiz do clone deste repositório
python3 scripts/generate_readme_index.py > /tmp/readme-index.md
```

Substitui no `README.md` **todo o conteúdo entre** `<!-- INDEX_START -->` e `<!-- INDEX_END -->` pela nova saída do script **incluindo** os próprios comentários no início e no fim (ou preserva os marcadores e cola apenas o miolo: desde `## Índice` até ao último capítulo).

Atualiza também `DESCRIPTIONS` no próprio script se precisares de uma **descrição** nova ou diferente para uma sessão.

## Citar este repositório

Ao usar ou referenciar este material:

- **Autor:** Tiago Cosmai  
- **Repositório:** https://github.com/tiagocosmai/study-materials  
- **Licença (documentação):** CC BY 4.0 — consulte `LICENSE-docs`  
- **Licença (código):** MIT — consulte `LICENSE-code`
