# Variáveis de ambiente e configuração

Este estudo aborda **como separar configuração de código**, **onde guardar segredos** e **como entregar parâmetros** em ambientes desde o laptop até produção em nuvem e Kubernetes. Os capítulos seguem o padrão dos demais materiais: **diagramas Mermaid**, **laboratórios com Docker** quando fizer sentido e **exemplos em várias linguagens** (leitura de secrets, clientes HTTP/SDK).

---

## Índice

1. [Conceitos: variáveis, arquivos e externalização](./01-conceitos-variaveis-e-config.md)
2. [HashiCorp Vault](./02-hashicorp-vault.md)
3. [HashiCorp Consul](./03-hashicorp-consul.md)
4. [Secret Managers na nuvem](./04-secret-managers-nuvem.md)
5. [Kubernetes: ConfigMap e Secret](./05-kubernetes-configmap-secrets.md)
6. [Helm Charts: values e templates](./06-helm-charts-values-templates.md)

---

## Estudos relacionados

- [DevOps — Docker, Kubernetes](../devops/README.md)
- [CI/CD na AWS](../ci-cd-aws/README.md)

---

## Referências gerais

- [The Twelve-Factor App — Config](https://12factor.net/config)
- [OWASP — Secrets Management](https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_password)

---

*Configuração **versionável** e segredos **fora do Git** são pré-requisitos para **GitOps** e **compliance**.*
