# Coleta, exportadores e PromQL

## Configuração de scrape

O Prometheus descobre e coleta métricas de **targets** definidos em **configuração** (arquivo YAML ou mecanismo de descoberta). Um **job** agrupa targets (ex.: job: "api"); cada target tem uma URL (ex.: http://host:9090/metrics). O Prometheus faz HTTP GET no endpoint, parseia o formato de texto e armazena as séries.

- **Static config** – Lista fixa de targets.
- **Service discovery** – Kubernetes, Consul, DNS, EC2: targets são descobertos dinamicamente; labels são anexados (namespace, pod, instance).
- **Relabeling** – Regras para filtrar ou modificar labels antes do scrape; útil para manter apenas targets relevantes e enriquecer labels.

## Exportadores

**Exportadores** são processos que expõem métricas de um sistema externo no formato Prometheus (endpoint /metrics):

- **Node Exporter** – Métricas do host (CPU, memória, disco, rede); um por nó em Kubernetes ou VM.
- **cAdvisor** – Métricas de containers (CPU, memória, I/O por container); integrado ao kubelet, Prometheus coleta via Kubernetes discovery.
- **Blackbox Exporter** – Probe para HTTP, TCP, ICMP; métricas de disponibilidade e latência de endpoints.
- **Aplicação** – Sua aplicação instrumenta com cliente Prometheus (client_golang, client_java, etc.) e expõe /metrics com contadores, gauges e histogramas de negócio (requests, erros, latência).

Em Kubernetes, o Prometheus usa **ServiceMonitor** (Prometheus Operator) ou anotações em Service/Pod para descobrir targets; scrape_interval e timeout são configuráveis.

## PromQL (basics)

**PromQL** é a linguagem de consulta: expressões retornam séries temporais ou escalares.

- **Seletor** – `http_requests_total{method="GET", status=~"2.."}` seleciona séries com essas labels; `=~` é regex.
- **Funções** – **rate(metric[5m])** = taxa de crescimento por segundo (para counter) na janela de 5 minutos; **increase(metric[1h])** = aumento total na janela.
- **Agregação** – **sum(rate(http_requests_total[5m])) by (path)** agrupa por path e soma as taxas.
- **Operadores** – Aritméticos (+, -, *, /) e comparação entre métricas; ex.: **rate(errors[5m]) / rate(requests[5m])** para taxa de erro.
- **Histogram** – **histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))** aproxima o p95 da latência.

Exemplos úteis:
- Latência p99: `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))`
- Taxa de erro: `rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])`
- Uso de CPU (node): `100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)`

## Resumo

| Tema | Prática |
|------|---------|
| **Scrape** | Configurar jobs e discovery; relabeling para filtrar e enriquecer. |
| **Exportadores** | Node, cAdvisor, Blackbox; aplicação com client Prometheus. |
| **PromQL** | rate/increase para counters; histogram_quantile para latência; agregações por label. |

No próximo capítulo: Alertmanager, regras de alerta, Grafana e boas práticas de observabilidade.

---

*Próximo: [Alertas, Grafana e boas práticas](./03-alertas-grafana.md).*
