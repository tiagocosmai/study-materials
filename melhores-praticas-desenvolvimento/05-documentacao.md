# Documentação e comentários

## O que documentar

- **README** – O que é o projeto, como rodar, dependências e primeiros passos.
- **APIs** – Contratos (endpoints, parâmetros, respostas, erros); OpenAPI/Swagger quando fizer sentido.
- **Decisões importantes** – ADRs (Architecture Decision Records) ou seção "Decisões" para o porquê de tecnologias e desenhos.
- **Ambiente** – Variáveis de ambiente, configuração de desenvolvimento e deploy.

## Comentários no código

- **Prefira código autoexplicativo** – Nomes e funções pequenas reduzem necessidade de comentários.
- **Use comentários para o "porquê"** – Regras de negócio, workarounds, restrições de biblioteca ou negócio.
- **Evite** comentários que repetem o que o código faz ou que ficam desatualizados (apague ou atualize ao mudar o código).
- **TODOs** – Use com critério; prefira issue/tarefa rastreável e referencie no comentário.

## Formato e manutenção

- **Markdown** no README e em docs – Fácil de versionar e de ler no Git.
- **Atualize junto com o código** – Doc desatualizada é pior que nenhuma: gera confusão e erros.
- **Exemplos** – Pequenos exemplos de uso (curl, trechos de código) ajudam muito; mantenha-os funcionando.

## Referências

- [Google – Engineering Practices – Documentation](https://google.github.io/engineering-practices/)
- [MADR – Markdown Any Decision Records](https://adr.github.io/madr/) – Template para ADRs
