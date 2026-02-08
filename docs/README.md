# Site estático – Study Materials

Página estática para exibir o conteúdo dos markdowns do repositório de forma dinâmica no **GitHub Pages**. O conteúdo é carregado via **GitHub raw** e renderizado no navegador (Markdown + Mermaid + highlight.js).

## Funcionalidades

- **Conteúdo dinâmico** – Leitura dos `.md` via `https://raw.githubusercontent.com/tiagocosmai/study-materials/<branch>/<path>`
- **Responsivo** – Mobile, tablet e desktop (breakpoints em 768px e 1200px)
- **Tema claro/escuro** – Toggle no header; preferência salva em `localStorage`; respeita `prefers-color-scheme`
- **Tradução (opcional)** – Widget Google Translate no header (pode não funcionar em todos os domínios)
- **Navegação** – Sidebar com estudos e capítulos definidos em `config.json`

## Como publicar no GitHub Pages

1. No repositório, vá em **Settings** → **Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione `main` (ou `master`) e a pasta **/docs**.
4. Salve. A página ficará em `https://<user>.github.io/study-materials/` (ou o nome do repo).

## Estrutura

- `config.json` – Lista de estudos e capítulos (paths dos `.md` no repo).
- `index.html` – Shell da página (header, sidebar, área de conteúdo).
- `styles.css` – Estilos responsivos e temas claro/escuro.
- `app.js` – Carrega o config, monta a navegação, busca o raw e renderiza Markdown + Mermaid.

## Manutenção

Ao adicionar um novo estudo ou capítulo no repositório, edite `config.json` e inclua o `readme` e os `chapters` no array `studies`. O branch usado nas URLs raw é o definido em `config.json` (`branch`).
