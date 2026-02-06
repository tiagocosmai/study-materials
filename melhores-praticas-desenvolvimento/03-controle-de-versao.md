# Controle de versão e colaboração

## Por que usar Git (e fluxo definido)

- **Histórico** – Saber o que mudou, quando e por quê.
- **Colaboração** – Várias pessoas no mesmo código sem sobrescrever trabalho.
- **Rollback** – Voltar a um estado estável em caso de problema.
- **Rastreabilidade** – Ligar mudanças a tarefas, bugs e releases.

## Boas práticas com Git

### Branches

- **main / master** – Representa o estado estável ou de produção; não commitar direto nela em times.
- **Branches de feature/fix** – Uma branch por tarefa ou correção; nomes curtos e descritivos: `feature/login-oauth`, `fix/calculo-imposto`.
- **Integração** – Use merge ou rebase de forma consistente; evite históricos confusos com muitos merges desnecessários.

### Commits

- **Atômicos** – Um commit = uma mudança lógica (uma feature, um fix, uma refatoração).
- **Mensagens claras** – Frase no imperativo descrevendo o que o commit faz: *"Adiciona validação de CPF no cadastro"*, não *"alterações"*.
- **Commit semântico** – Prefixos como `feat:`, `fix:`, `docs:`, `refactor:` ajudam a gerar changelogs e a filtrar histórico (detalhes no estudo de [Git e Commit Semântico](../README.md)).

### Pull requests (merge requests)

- **Descrição** – O que foi feito, por quê e como testar.
- **Revisão** – Outra pessoa revisa código e contexto antes de integrar.
- **CI** – Build e testes passando antes de aprovar o merge.

## Code review

- Foco em **clareza**, **segurança** e **alinhamento com o padrão do projeto**.
- Comentários objetivos e construtivos; sugestões de código quando fizer sentido.
- Revisar em tempo razoável para não travar o fluxo da equipe.

Para detalhes de fluxo (Git Flow, trunk-based etc.) e convenção de commits, use os estudos específicos de Git listados no [README principal](../README.md).
