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

## Índice

Os estudos estão organizados por tema. No [site](https://tiagocosmai.github.io/study-materials/) o menu lateral segue a mesma organização.

### Fundamentos e práticas

| Estudo | Descrição |
|--------|-----------|
| [**Design Patterns**](./design-patterns/README.md) | Padrões de projeto mais utilizados, com exemplos em Java, C#, TypeScript/Node, React, Clojure e diagramas. |
| [**Melhores práticas de desenvolvimento**](./melhores-praticas-desenvolvimento/README.md) | Código limpo, controle de versão, testes, documentação, segurança e performance – práticas consolidadas para desenvolvimento de software. |
| [**Versionamento, Git e Pull Requests**](./versionamento-git-pr/README.md) | Versionamento de aplicações (SemVer), Git/GitHub, Git Flow, commit semântico e melhores práticas para criação e validação de PRs. |
| [**Teoria, análise e diagramas**](./teoria-analise-diagramas/README.md) | Algoritmos, estruturas de dados, fluxograma, diagrama de sequência/estados, UML e ER: índice de símbolos e exemplos em cenários reais e complexos. |
| [**Paradigmas de programação**](./paradigmas-programacao/README.md) | Procedural, orientado a objetos, orientado a eventos, funcional (React e Clojure), declarativo e reativo: conceitos, quando usar, diagramas e exemplos em C, Java, TypeScript, React e Clojure. |
| [**Gestão e metodologias**](./gestao-metodologias/README.md) | Scrum, Kanban, Six Sigma e PMI/PMBOK: fundamentos, diagramas Mermaid e exemplos ilustrativos em Spring Boot, C#, JavaScript e Python. |

### APIs e arquitetura

| Estudo | Descrição |
|--------|-----------|
| [**APIs com Clojure**](./clojure-apis/README.md) | Estudo dirigido para criar e consumir APIs em Clojure: do Hello World ao acesso a bancos de dados e APIs REST. Inclui instalação (WSL/Ubuntu e macOS). |
| [**Casos de Uso**](./casos-uso/README.md) | Desafios de arquitetura: situações-problema com múltiplas soluções, prós/contras e diagramas (Kubernetes, Kafka, Redis, S3, microserviços). |
| [**Node.js**](./nodejs/README.md) | Runtime V8 e libuv, *event loop*, história, arquitetura limpa, hexagonal, SOLID, frameworks, ORMs, instalação, comparação com Java e Python, referências. |
| [**Princípios e protocolos de APIs**](./apis-arquitetura/README.md) | SOLID, Clean Code, ágil em APIs, hexagonal, clean architecture, saga, microsserviços, HTTP/REST, GraphQL, SOAP, Falcor, contratos, WebSockets, SSE, webhooks, WebRTC, gRPC, debug multi-stack; MQTT e mensageria na sessão [Mensageria](./mensageria/README.md). |

### Operação e observabilidade

| Estudo | Descrição |
|--------|-----------|
| [**Logs de aplicação**](./logs-aplicacao/README.md) | Níveis de log (TRACE a FATAL), quando usar cada um e melhores práticas: estrutura, segurança, correlação e operação. |
| [**Prometheus e observabilidade**](./prometheus-observabilidade/README.md) | Monitoramento e observabilidade com Prometheus, PromQL, Alertmanager e Grafana. |
| [**Observabilidade estendida**](./observabilidade-estendida/README.md) | Grafana (Docker lab, provisionamento, API, alertas) e Zabbix (componentes, Docker lab, agente, triggers, LLD). |

### Prevenção e detecção de vulnerabilidades

| Estudo | Descrição |
|--------|-----------|
| [**Prevenção e detecção de vulnerabilidades**](./prevencao-deteccao-vulnerabilidades/README.md) | Abordagem preventiva vs detecção, defesa em profundidade e um capítulo por ferramenta: Trivy, Datadog, AWS Inspector, Snyk e Semgrep — instalação, projeto de laboratório, CI e exemplos em várias linguagens. |

### DevOps e infraestrutura

| Estudo | Descrição |
|--------|-----------|
| [**DevOps**](./devops/README.md) | Conceitos (DevOps, DevSecOps, SRE, GitOps), Docker, Kubernetes, GitHub Actions, Argo CD e Jenkins. |
| [**CI/CD na AWS**](./ci-cd-aws/README.md) | Integração e implantação contínuas na AWS (CodePipeline, CodeBuild, CodeDeploy, ECR). |
| [**Microsserviços Clojure/Finagle**](./microsservicos-clojure-finagle/README.md) | Microsserviços escaláveis em Clojure com Finagle, programação funcional e arquitetura hexagonal. |
| [**Variáveis de ambiente e configuração**](./variaveis-ambiente-configuracao/README.md) | Externalização (*12-factor*), Vault, Consul KV, Secret Managers (AWS, Azure, GCP), ConfigMap/Secret no Kubernetes e Helm (values, templates, segredos). |

### Mensageria

| Estudo | Descrição |
|--------|-----------|
| [**Mensageria**](./mensageria/README.md) | RabbitMQ (AMQP), Amazon SQS, BullMQ, comparativo Kafka/RabbitMQ/SQS, MQTT, Redis como fila/pub/sub; links para Saga, Webhooks e DynamoDB/Redis. |
| [**Kafka – alto desempenho**](./kafka-alto-desempenho/README.md) | Conceitos, particionamento, consumidores e padrões de integração com Apache Kafka (mesma secção no site). |

### Dados e persistência

| Estudo | Descrição |
|--------|-----------|
| [**Bancos de dados**](./bancos-de-dados/README.md) | Relacionais (MySQL, PostgreSQL, Oracle, Supabase), não relacionais (MongoDB, DynamoDB, Redis), ORMs (C#, Node.js, Clojure, Python, Java), transações e consistência: conceitos, scripts e exemplos. |
| [**Datomic**](./datomic/README.md) | Armazenamento de dados no Datomic: modelo imutável, temporal, transações e Datalog. |
| [**DynamoDB**](./dynamodb/README.md) | Armazenamento de dados no Amazon DynamoDB: modelo, chaves, operações e boas práticas. |

### Frontend

*Tópicos planejados:* React (Context API, Redux, Tailwind CSS, WebSockets) · React Native · Flutter · Microfrontends (Module Federation, Single-SPA)

### Qualidade e testes

*Tópicos planejados:* Testes (unitários, integrados, regressivos) · Playwright · Cypress · Selenium

### Inteligência artificial

*Tópicos planejados:* Engenharia de prompts · Construção de agentes de IA · n8n · LangChain / Flowise · LLM e SLM · Clojure + IA

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
