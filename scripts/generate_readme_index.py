#!/usr/bin/env python3
"""
Gera o bloco Markdown do ## Índice no README.md raiz a partir de docs/config.json.

Saída: Markdown completo da secção (começa por ## Índice).

Integração manual no README principal:
  1. Mantém os comentários HTML <!-- INDEX_START --> e <!-- INDEX_END --> no README.md.
  2. python3 scripts/generate_readme_index.py > /tmp/readme-index.md
  3. Substitui o conteúdo entre esses dois comentários pela nova saída (+ marcadores ou não,
     conforme preferires).

Descrições curtas por sessão: dicionário DESCRIPTIONS neste ficheiro (deve cobrir cada `id`
presente em config.json, exceto home).
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "docs" / "config.json"

# Descrições curtas (1 linha) — alinhar ao propósito de cada sessão.
DESCRIPTIONS: dict[str, str] = {
    "design-patterns": (
        "Padrões de projeto mais utilizados, com exemplos em Java, C#, TypeScript/Node, "
        "React, Clojure e diagramas."
    ),
    "melhores-praticas": (
        "Código limpo, controle de versão, testes, documentação, segurança e performance – "
        "práticas consolidadas para desenvolvimento de software."
    ),
    "versionamento-git-pr": (
        "Versionamento de aplicações (SemVer), Git/GitHub, Git Flow, commit semântico e "
        "melhores práticas para criação e validação de PRs."
    ),
    "teoria-analise-diagramas": (
        "Algoritmos, estruturas de dados, fluxograma, diagrama de sequência/estados, UML e ER: "
        "índice de símbolos e exemplos em cenários reais e complexos."
    ),
    "paradigmas-programacao": (
        "Procedural, orientado a objetos, orientado a eventos, funcional (React e Clojure), "
        "declarativo e reativo: conceitos, quando usar, diagramas e exemplos em C, Java, "
        "TypeScript, React e Clojure."
    ),
    "gestao-metodologias": (
        "Scrum, Kanban, Six Sigma e PMI/PMBOK: fundamentos, diagramas Mermaid e exemplos "
        "ilustrativos em Spring Boot, C#, JavaScript e Python."
    ),
    "clojure-apis": (
        "Estudo dirigido para criar e consumir APIs em Clojure: do Hello World ao acesso a "
        "bancos de dados e APIs REST. Inclui instalação (WSL/Ubuntu e macOS)."
    ),
    "casos-uso": (
        "Desafios de arquitetura: situações-problema com múltiplas soluções, prós/contras e "
        "diagramas (Kubernetes, Kafka, Redis, S3, microserviços)."
    ),
    "nodejs": (
        "Runtime V8 e libuv, event loop, história, arquitetura limpa, hexagonal, SOLID, "
        "frameworks, ORMs, instalação, comparação com Java e Python, referências."
    ),
    "apis-arquitetura": (
        "SOLID, Clean Code, ágil em APIs, hexagonal, clean architecture, saga, microsserviços, "
        "HTTP/REST, GraphQL, SOAP, Falcor, contratos, WebSockets, SSE, webhooks, WebRTC, gRPC, "
        "debug multi-stack; MQTT e mensageria na sessão Mensageria."
    ),
    "logs-aplicacao": (
        "Níveis de log (TRACE a FATAL), quando usar cada um e melhores práticas: estrutura, "
        "segurança, correlação e operação."
    ),
    "prometheus-observabilidade": (
        "Monitoramento e observabilidade com Prometheus, PromQL, Alertmanager e Grafana."
    ),
    "observabilidade-estendida": (
        "Grafana (Docker lab, provisionamento, API, alertas) e Zabbix (componentes, Docker lab, "
        "agente, triggers, LLD)."
    ),
    "prevencao-deteccao-vulnerabilidades": (
        "Abordagem preventiva vs detecção, defesa em profundidade e um capítulo por ferramenta: "
        "Trivy, Datadog, AWS Inspector, Snyk e Semgrep — instalação, laboratório, CI e exemplos "
        "em várias linguagens."
    ),
    "devops": (
        "Conceitos (DevOps, DevSecOps, SRE, GitOps), Docker, Kubernetes, GitHub Actions, "
        "Argo CD e Jenkins."
    ),
    "ci-cd-aws": (
        "Integração e implantação contínuas na AWS (CodePipeline, CodeBuild, CodeDeploy, ECR)."
    ),
    "microsservicos-clojure-finagle": (
        "Microsserviços escaláveis em Clojure com Finagle, programação funcional e arquitetura "
        "hexagonal."
    ),
    "variaveis-ambiente-configuracao": (
        "Externalização (12-factor), Vault, Consul KV, Secret Managers (AWS, Azure, GCP), "
        "ConfigMap/Secret no Kubernetes e Helm (values, templates, segredos)."
    ),
    "mensageria": (
        "RabbitMQ (AMQP), Amazon SQS, BullMQ, comparativo Kafka/RabbitMQ/SQS, MQTT, Redis como "
        "fila/pub/sub; links para Saga, Webhooks e DynamoDB/Redis."
    ),
    "kafka-alto-desempenho": (
        "Conceitos, particionamento, consumidores e padrões de integração com Apache Kafka "
        "(mesma secção no site)."
    ),
    "frontend": (
        "Visão geral, HTML, CSS, JavaScript, Tailwind, React (Context, Redux, WebSockets), "
        "React Native, Vue, Angular, Svelte, Next.js, Flutter e microfrontends (Module "
        "Federation, single-spa)."
    ),
    "bancos-de-dados": (
        "Relacionais (MySQL, PostgreSQL, Oracle, Supabase), não relacionais (MongoDB, DynamoDB, "
        "Redis), ORMs (C#, Node.js, Clojure, Python, Java), transações e consistência: "
        "conceitos, scripts e exemplos."
    ),
    "datomic": (
        "Armazenamento de dados no Datomic: modelo imutável, temporal, transações e Datalog."
    ),
    "dynamodb": (
        "Armazenamento de dados no Amazon DynamoDB: modelo, chaves, operações e boas práticas."
    ),
    "qualidade-testes": (
        "Pirâmide de testes, unitários, integração e regressão; exemplos em Python, Node.js e "
        "Java; automação Playwright, Cypress e Selenium."
    ),
    "inteligencia-artificial": (
        "Engenharia de prompts, agentes, n8n, LangChain / Flowise, LLM vs SLM, Clojure na JVM; "
        "capítulo dedicado a exemplos Python, Node.js e Java (SDK, HTTP, tools, LangChain / "
        "LangChain4j)."
    ),
}


def main() -> None:
    cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    section_order: list[str] = cfg["sectionOrder"]
    studies: list[dict] = cfg["studies"]

    by_section: dict[str, list[dict]] = {s: [] for s in section_order}
    for study in studies:
        if study.get("id") == "home":
            continue
        sec = study.get("section")
        if sec in by_section:
            by_section[sec].append(study)

    lines: list[str] = []
    lines.append("## Índice\n")
    lines.append(
        "\nOs estudos estão organizados por tema. No "
        "[site](https://tiagocosmai.github.io/study-materials/) o menu lateral segue a mesma "
        "organização.\n\n"
        "Em cada sessão: primeiro o link para o **README** (índice da pasta); depois uma lista "
        "com **links diretos para cada capítulo** (artigo). A ordem espelha "
        "[`docs/config.json`](./docs/config.json).\n"
    )

    for section in section_order:
        items = by_section.get(section, [])
        if not items:
            continue
        lines.append(f"\n### {section}\n\n")
        for study in items:
            sid = study["id"]
            title = study["title"]
            readme = study["readme"]
            desc = DESCRIPTIONS.get(sid, "").strip()
            lines.append(f"#### [{title}](./{readme})\n\n")
            if desc:
                lines.append(f"{desc}\n\n")
            for ch in study.get("chapters", []):
                ct = ch["title"]
                cp = ch["path"]
                lines.append(f"- [{ct}](./{cp})\n")
            lines.append("\n")

    print("".join(lines).rstrip() + "\n")


if __name__ == "__main__":
    main()
