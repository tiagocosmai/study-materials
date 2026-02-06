# Segurança e performance

## Segurança – princípios gerais

- **Não confie em entrada do usuário** – Valide e sanitize sempre; use allowlists quando possível.
- **Princípio do menor privilégio** – Contas, permissões e tokens com o mínimo necessário.
- **Secrets fora do código** – Variáveis de ambiente ou vaults; nunca commitar senhas, API keys ou certificados.
- **Dependências** – Atualize bibliotecas; use ferramentas para vulnerabilidades conhecidas (ex.: OWASP, Trivy, npm audit).
- **HTTPS** – Tráfego criptografado em produção; cookies com flags seguras quando aplicável.

Referência: [OWASP Top Ten](https://owasp.org/www-project-top-ten/) para os riscos mais comuns em aplicações web.

## Performance – boas práticas

- **Medir antes de otimizar** – Use métricas e profiling para encontrar gargalos reais.
- **Consultas e índices** – Evite N+1; use índices adequados; limite e pagine resultados.
- **Cache** – Onde fizer sentido (respostas, sessões, dados estáveis); defina TTL e estratégia de invalidação.
- **Assíncrono e filas** – Operações pesadas ou que não precisam ser síncronas: workers, filas (Kafka, RabbitMQ, SQS etc.).
- **Recursos** – Conexões (DB, HTTP), memória e CPU; não deixe vazamentos ou uso desnecessário em loop.

## Operação

- **Logs** – Níveis consistentes (debug, info, warn, error); evite dados sensíveis em log.
- **Monitoramento** – Métricas de negócio e técnicas; alertas para falhas e degradação.
- **Health checks** – Endpoints para o orquestrador (Kubernetes, load balancer) verificar se a aplicação está viva e pronta.

Os estudos de [Docker](../README.md), [Kubernetes](../README.md), [Redis](../README.md), [Kafka/RabbitMQ/SQS](../README.md) e [Prevenção de vulnerabilidades](../README.md) aprofundam esses temas no repositório.
