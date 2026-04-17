# Documentação para Estudo

[![License (docs)](https://img.shields.io/badge/License%20(docs)-CC%20BY%204.0-lightgrey)](LICENSE-docs)
[![License (code)](https://img.shields.io/badge/License%20(code)-MIT-green)](LICENSE-code)
[![GitHub Pages](https://img.shields.io/badge/View_on-GitHub_Pages-222?style=flat-square&logo=github)](https://tiagocosmai.github.io/study-materials/)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/tiagocosmai/study-materials/graphs/commit-activity)

Repositório de documentações e estudos dirigidos, com índice, exemplos de código e referências.

**Ver online:** [https://tiagocosmai.github.io/study-materials/](https://tiagocosmai.github.io/study-materials/) — na Home do site você encontra [perfil e sobre mim](https://tiagocosmai.github.io/study-materials/#aboutme/README.md).

---

## Sobre mim

[**Clique aqui**](./aboutme/README.md) | Quem é Tiago Cosmai?.


<!-- INDEX_START -->
## Índice

Os estudos estão organizados por tema. No [site](https://tiagocosmai.github.io/study-materials/) o menu lateral segue a mesma organização.

Em cada sessão: primeiro o link para o **README** (índice da pasta); depois uma lista com **links diretos para cada capítulo** (artigo). A ordem espelha [`docs/config.json`](./docs/config.json).

### Fundamentos e práticas

#### [Design Patterns](./design-patterns/README.md)

Padrões de projeto mais utilizados, com exemplos em Java, C#, TypeScript/Node, React, Clojure e diagramas.

- [Visão geral](./design-patterns/01-visao-geral.md)
- [Padrões criacionais](./design-patterns/02-padroes-criacionais.md)
- [Padrões estruturais](./design-patterns/03-padroes-estruturais.md)
- [Padrões comportamentais](./design-patterns/04-padroes-comportamentais.md)

#### [Melhores práticas de desenvolvimento](./melhores-praticas-desenvolvimento/README.md)

Código limpo, controle de versão, testes, documentação, segurança e performance – práticas consolidadas para desenvolvimento de software.

- [Visão geral](./melhores-praticas-desenvolvimento/01-visao-geral.md)
- [Código limpo](./melhores-praticas-desenvolvimento/02-codigo-limpo.md)
- [Controle de versão](./melhores-praticas-desenvolvimento/03-controle-de-versao.md)
- [Testes e qualidade](./melhores-praticas-desenvolvimento/04-testes-e-qualidade.md)
- [Documentação](./melhores-praticas-desenvolvimento/05-documentacao.md)
- [Segurança e performance](./melhores-praticas-desenvolvimento/06-seguranca-e-performance.md)

#### [Versionamento, Git e PR](./versionamento-git-pr/README.md)

Versionamento de aplicações (SemVer), Git/GitHub, Git Flow, commit semântico e melhores práticas para criação e validação de PRs.

- [Versionamento de aplicações](./versionamento-git-pr/01-versionamento-aplicacoes.md)
- [Git e GitHub](./versionamento-git-pr/02-git-github.md)
- [Git Flow e commit semântico](./versionamento-git-pr/03-git-flow-commit-semantico.md)
- [Melhores práticas PR](./versionamento-git-pr/04-melhores-praticas-pull-requests.md)

#### [Teoria, análise e diagramas](./teoria-analise-diagramas/README.md)

Algoritmos, estruturas de dados, fluxograma, diagrama de sequência/estados, UML e ER: índice de símbolos e exemplos em cenários reais e complexos.

- [Algoritmos em contextos reais](./teoria-analise-diagramas/01-algoritmos.md)
- [Estruturas de dados na prática](./teoria-analise-diagramas/02-estrutura-dados.md)
- [Fluxograma: símbolos e cenários](./teoria-analise-diagramas/03-fluxograma.md)
- [Diagrama de sequência: símbolos e cenários](./teoria-analise-diagramas/04-diagrama-sequencia.md)
- [Diagrama de estados: símbolos e cenários](./teoria-analise-diagramas/05-diagrama-estados.md)
- [UML: visões e diagramas](./teoria-analise-diagramas/06-uml.md)
- [Diagrama ER: símbolos e modelos](./teoria-analise-diagramas/07-diagrama-er.md)

#### [Gestão e metodologias](./gestao-metodologias/README.md)

Scrum, Kanban, Six Sigma e PMI/PMBOK: fundamentos, diagramas Mermaid e exemplos ilustrativos em Spring Boot, C#, JavaScript e Python.

- [Scrum](./gestao-metodologias/01-scrum.md)
- [Kanban](./gestao-metodologias/02-kanban.md)
- [Six Sigma](./gestao-metodologias/03-six-sigma.md)
- [PMI / PMBOK](./gestao-metodologias/04-pmi-pmbok.md)

#### [Paradigmas de programação](./paradigmas-programacao/README.md)

Procedural, orientado a objetos, orientado a eventos, funcional (React e Clojure), declarativo e reativo: conceitos, quando usar, diagramas e exemplos em C, Java, TypeScript, React e Clojure.

- [Visão geral e mapa dos paradigmas](./paradigmas-programacao/01-visao-geral.md)
- [Programação procedural](./paradigmas-programacao/02-programacao-procedural.md)
- [Programação orientada a objetos](./paradigmas-programacao/03-programacao-orientada-a-objetos.md)
- [Programação orientada a eventos](./paradigmas-programacao/04-programacao-orientada-a-eventos.md)
- [Programação funcional (React e Clojure)](./paradigmas-programacao/05-programacao-funcional.md)
- [Programação declarativa](./paradigmas-programacao/06-programacao-declarativa.md)
- [Programação reativa](./paradigmas-programacao/07-programacao-reativa.md)


### APIs e arquitetura

#### [APIs com Clojure](./clojure-apis/README.md)

Estudo dirigido para criar e consumir APIs em Clojure: do Hello World ao acesso a bancos de dados e APIs REST. Inclui instalação (WSL/Ubuntu e macOS).

- [Instalação](./clojure-apis/01-instalacao.md)
- [Hello World](./clojure-apis/02-hello-world.md)
- [Funções práticas](./clojure-apis/03-funcoes-praticas.md)
- [API REST](./clojure-apis/04-api-rest.md)
- [Banco de dados](./clojure-apis/05-banco-de-dados.md)
- [Consumir APIs](./clojure-apis/06-consumir-apis.md)

#### [Casos de Uso](./casos-uso/README.md)

Desafios de arquitetura: situações-problema com múltiplas soluções, prós/contras e diagramas (Kubernetes, Kafka, Redis, S3, microserviços).

- [Desafios de arquitetura](./casos-uso/desafios-arquitetura.md)
- [Case: Engine de Precificação e Promoções -- Arquitetura Distribuída](./casos-uso/tractian.md)

#### [Node.js](./nodejs/README.md)

Runtime V8 e libuv, event loop, história, arquitetura limpa, hexagonal, SOLID, frameworks, ORMs, instalação, comparação com Java e Python, referências.

- [Introdução, história e runtime interno](./nodejs/01-introducao-historia-runtime.md)
- [Arquitetura limpa, hexagonal e SOLID](./nodejs/02-arquitetura-limpa-hexagonal-solid.md)
- [Ecossistema, instalação, comparações e referências](./nodejs/03-ecossistema-instalacao-comparacoes.md)

#### [Princípios e protocolos de APIs](./apis-arquitetura/README.md)

SOLID, Clean Code, ágil em APIs, hexagonal, clean architecture, saga, microsserviços, HTTP/REST, GraphQL, SOAP, Falcor, contratos, WebSockets, SSE, webhooks, WebRTC, gRPC, debug multi-stack; MQTT e mensageria na sessão Mensageria.

- [SOLID](./apis-arquitetura/01-solid.md)
- [Clean Code](./apis-arquitetura/02-clean-code.md)
- [Metodologia ágil (APIs)](./apis-arquitetura/03-metodologia-agil.md)
- [Arquitetura hexagonal](./apis-arquitetura/04-arquitetura-hexagonal.md)
- [Arquitetura limpa](./apis-arquitetura/05-arquitetura-limpa.md)
- [Saga](./apis-arquitetura/06-saga.md)
- [Microsserviços](./apis-arquitetura/07-arquitetura-microservicos.md)
- [HTTP](./apis-arquitetura/08-http.md)
- [RESTful](./apis-arquitetura/09-restful.md)
- [GraphQL](./apis-arquitetura/10-graphql.md)
- [SOAP](./apis-arquitetura/11-soap.md)
- [Falcor](./apis-arquitetura/12-falcor.md)
- [Request/response padronizado](./apis-arquitetura/13-normalizacao-request-response.md)
- [WebSockets](./apis-arquitetura/14-websockets.md)
- [Server-Sent Events](./apis-arquitetura/15-server-sent-events-sse.md)
- [Webhooks](./apis-arquitetura/16-webhooks.md)
- [WebRTC](./apis-arquitetura/18-webrtc.md)
- [gRPC](./apis-arquitetura/19-grpc.md)
- [Debug (Clojure, C#, Spring, Python)](./apis-arquitetura/20-debug-aplicacoes.md)


### Operação e observabilidade

#### [Logs de aplicação](./logs-aplicacao/README.md)

Níveis de log (TRACE a FATAL), quando usar cada um e melhores práticas: estrutura, segurança, correlação e operação.

- [Níveis e melhores práticas](./logs-aplicacao/01-levels-e-boas-praticas.md)

#### [Prometheus e observabilidade](./prometheus-observabilidade/README.md)

Monitoramento e observabilidade com Prometheus, PromQL, Alertmanager e Grafana.

- [Conceitos e métricas](./prometheus-observabilidade/01-conceitos-metricas.md)
- [Coleta e PromQL](./prometheus-observabilidade/02-coleta-promql.md)
- [Alertas e Grafana](./prometheus-observabilidade/03-alertas-grafana.md)

#### [Observabilidade estendida](./observabilidade-estendida/README.md)

Grafana (Docker lab, provisionamento, API, alertas) e Zabbix (componentes, Docker lab, agente, triggers, LLD).

- [Grafana](./observabilidade-estendida/01-grafana.md)
- [Zabbix](./observabilidade-estendida/02-zabbix.md)


### Prevenção e detecção de vulnerabilidades

#### [Prevenção e detecção de vulnerabilidades](./prevencao-deteccao-vulnerabilidades/README.md)

Abordagem preventiva vs detecção, defesa em profundidade e um capítulo por ferramenta: Trivy, Datadog, AWS Inspector, Snyk e Semgrep — instalação, laboratório, CI e exemplos em várias linguagens.

- [Trivy](./prevencao-deteccao-vulnerabilidades/01-trivy.md)
- [Datadog](./prevencao-deteccao-vulnerabilidades/02-datadog.md)
- [AWS Inspector](./prevencao-deteccao-vulnerabilidades/03-aws-inspector.md)
- [Snyk](./prevencao-deteccao-vulnerabilidades/04-snyk.md)
- [Semgrep](./prevencao-deteccao-vulnerabilidades/05-semgrep.md)


### DevOps e infraestrutura

#### [DevOps](./devops/README.md)

Conceitos (DevOps, DevSecOps, SRE, GitOps), Docker, Kubernetes, GitHub Actions, Argo CD e Jenkins.

- [Conceitos DevOps, DevSecOps](./devops/01-conceitos-devops-devsecops.md)
- [Docker](./devops/02-docker.md)
- [Kubernetes](./devops/03-kubernetes.md)
- [GitHub Actions](./devops/04-github-actions.md)
- [Argo CD](./devops/05-argocd.md)
- [Jenkins](./devops/06-jenkins.md)

#### [Variáveis de ambiente e configuração](./variaveis-ambiente-configuracao/README.md)

Externalização (12-factor), Vault, Consul KV, Secret Managers (AWS, Azure, GCP), ConfigMap/Secret no Kubernetes e Helm (values, templates, segredos).

- [Conceitos: variáveis e externalização](./variaveis-ambiente-configuracao/01-conceitos-variaveis-e-config.md)
- [HashiCorp Vault](./variaveis-ambiente-configuracao/02-hashicorp-vault.md)
- [HashiCorp Consul](./variaveis-ambiente-configuracao/03-hashicorp-consul.md)
- [Secret Managers na nuvem](./variaveis-ambiente-configuracao/04-secret-managers-nuvem.md)
- [Kubernetes: ConfigMap e Secret](./variaveis-ambiente-configuracao/05-kubernetes-configmap-secrets.md)
- [Helm Charts: values e templates](./variaveis-ambiente-configuracao/06-helm-charts-values-templates.md)

#### [CI/CD na AWS](./ci-cd-aws/README.md)

Integração e implantação contínuas na AWS (CodePipeline, CodeBuild, CodeDeploy, ECR).

- [Conceitos e serviços](./ci-cd-aws/01-conceitos-servicos.md)
- [Pipeline: build e artefatos](./ci-cd-aws/02-pipeline-build-artefatos.md)
- [Deploy e IaC](./ci-cd-aws/03-deploy-iac.md)

#### [Microsserviços Clojure/Finagle](./microsservicos-clojure-finagle/README.md)

Microsserviços escaláveis em Clojure com Finagle, programação funcional e arquitetura hexagonal.

- [Visão geral e arquitetura](./microsservicos-clojure-finagle/01-visao-geral-arquitetura.md)
- [Finagle e comunicação](./microsservicos-clojure-finagle/02-finagle-comunicacao.md)
- [Arquitetura hexagonal e implementação](./microsservicos-clojure-finagle/03-hexagonal-implementacao.md)


### Mensageria

#### [Mensageria](./mensageria/README.md)

RabbitMQ (AMQP), Amazon SQS, BullMQ, comparativo Kafka/RabbitMQ/SQS, MQTT, Redis como fila/pub/sub; links para Saga, Webhooks e DynamoDB/Redis.

- [RabbitMQ](./mensageria/01-rabbitmq.md)
- [Amazon SQS](./mensageria/02-amazon-sqs.md)
- [BullMQ](./mensageria/03-bullmq.md)
- [Kafka, RabbitMQ e SQS — comparativo](./mensageria/04-kafka-rabbitmq-sqs-comparativo.md)
- [MQTT](./mensageria/05-mqtt.md)
- [Redis — filas e pub/sub](./mensageria/06-redis-filas-pubsub.md)

#### [Kafka – alto desempenho](./kafka-alto-desempenho/README.md)

Conceitos, particionamento, consumidores e padrões de integração com Apache Kafka (mesma secção no site).

- [Conceitos e modelo](./kafka-alto-desempenho/01-conceitos-modelo.md)
- [Particionamento e consumidores](./kafka-alto-desempenho/02-particionamento-consumidores.md)
- [Padrões e integração](./kafka-alto-desempenho/03-padroes-integracao.md)


### Frontend

#### [Frontend](./frontend/README.md)

Visão geral, HTML, CSS, JavaScript, Tailwind, React (Context, Redux, WebSockets), React Native, Vue, Angular, Svelte, Next.js, Flutter e microfrontends (Module Federation, single-spa).

- [Visão geral do frontend](./frontend/01-visao-geral-frontend.md)
- [HTML](./frontend/02-html.md)
- [CSS](./frontend/03-css.md)
- [JavaScript](./frontend/04-javascript.md)
- [Tailwind CSS](./frontend/05-tailwind-css.md)
- [React](./frontend/06-react.md)
- [React Native](./frontend/07-react-native.md)
- [Vue.js](./frontend/08-vue.md)
- [Angular](./frontend/09-angular.md)
- [Svelte](./frontend/10-svelte.md)
- [Next.js](./frontend/11-nextjs.md)
- [Flutter](./frontend/12-flutter.md)
- [Microfrontends](./frontend/13-microfrontends.md)


### Dados e persistência

#### [Bancos de dados](./bancos-de-dados/README.md)

Relacionais (MySQL, PostgreSQL, Oracle, Supabase), não relacionais (MongoDB, DynamoDB, Redis), ORMs (C#, Node.js, Clojure, Python, Java), transações e consistência: conceitos, scripts e exemplos.

- [Visão geral: relacional vs não relacional](./bancos-de-dados/01-visao-geral.md)
- [Bancos relacionais: conceitos e SQL](./bancos-de-dados/02-relacionais-conceitos-sql.md)
- [MySQL](./bancos-de-dados/03-mysql.md)
- [PostgreSQL](./bancos-de-dados/04-postgresql.md)
- [Oracle](./bancos-de-dados/05-oracle.md)
- [Supabase](./bancos-de-dados/06-supabase.md)
- [Bancos não relacionais: conceitos](./bancos-de-dados/07-nao-relacionais-conceitos.md)
- [MongoDB](./bancos-de-dados/08-mongodb.md)
- [DynamoDB e Redis](./bancos-de-dados/09-dynamodb-redis.md)
- [ORMs: C#, Node.js, Clojure, Python, Java](./bancos-de-dados/10-orms.md)
- [Transações e consistência](./bancos-de-dados/11-transacoes-consistencia.md)

#### [Datomic](./datomic/README.md)

Armazenamento de dados no Datomic: modelo imutável, temporal, transações e Datalog.

- [Modelo de dados e conceitos](./datomic/01-modelo-conceitos.md)
- [Transações e consultas](./datomic/02-transacoes-consultas.md)
- [Arquitetura e operação](./datomic/03-arquitetura-operacao.md)

#### [DynamoDB](./dynamodb/README.md)

Armazenamento de dados no Amazon DynamoDB: modelo, chaves, operações e boas práticas.

- [Modelo de dados e chaves](./dynamodb/01-modelo-chaves.md)
- [Operações e índices](./dynamodb/02-operacoes-indices.md)
- [Capacidade e boas práticas](./dynamodb/03-capacidade-boas-praticas.md)


### Qualidade e testes

#### [Qualidade e testes](./qualidade-testes/README.md)

Pirâmide de testes, unitários, integração e regressão; exemplos em Python, Node.js e Java; automação Playwright, Cypress e Selenium.

- [Pirâmide, tipos e regressão](./qualidade-testes/01-piramide-tipos-regressao.md)
- [Testes unitários: Python, Node.js, Java](./qualidade-testes/02-testes-unitarios-python-node-java.md)
- [Integração e testes regressivos](./qualidade-testes/03-integracao-testes-regressivos.md)
- [Playwright](./qualidade-testes/04-playwright.md)
- [Cypress](./qualidade-testes/05-cypress.md)
- [Selenium WebDriver](./qualidade-testes/06-selenium.md)


### Inteligência artificial

#### [Inteligência artificial](./inteligencia-artificial/README.md)

Engenharia de prompts, agentes, n8n, LangChain / Flowise, LLM vs SLM, Clojure na JVM; capítulo dedicado a exemplos Python, Node.js e Java (SDK, HTTP, tools, LangChain / LangChain4j).

- [Engenharia de prompts](./inteligencia-artificial/01-engenharia-de-prompts.md)
- [Construção de agentes de IA](./inteligencia-artificial/02-construcao-de-agentes.md)
- [n8n](./inteligencia-artificial/03-n8n.md)
- [LangChain e Flowise](./inteligencia-artificial/04-langchain-e-flowise.md)
- [LLM e SLM](./inteligencia-artificial/05-llm-e-slm.md)
- [Clojure e IA](./inteligencia-artificial/06-clojure-e-ia.md)
- [Exemplos práticos — Python, Node.js e Java](./inteligencia-artificial/07-exemplos-praticos-python-node-java.md)


<!-- INDEX_END -->

---

O conteúdo pode ser visualizado em **[GitHub Pages](https://tiagocosmai.github.io/study-materials/)** (pasta [docs/](./docs/)): site estático que carrega os markdowns dinamicamente via GitHub raw, com tema claro/escuro e layout responsivo.

---

## Estrutura de cada documentação

Cada estudo fica em um diretório próprio, com:

- **Markdown** – textos, exemplos e explicações
- **imagens/** – diagramas, screenshots e figuras de apoio
- **Referências** – links para documentação oficial, artigos e recursos recomendados

---

## Licença

Este repositório utiliza uma licença híbrida:

- 📄 **Documentação e diagramas**: Creative Commons Attribution 4.0 (CC BY 4.0)
- 💻 **Código-fonte**: MIT License

Consulte os arquivos `LICENSE-docs` e `LICENSE-code` para mais detalhes.

---

## Contribuir e citar

Como contribuir com sugestões ou PRs e como citar este repositório: **[CONTRIBUTING.md](./CONTRIBUTING.md)**. 
