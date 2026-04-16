# Grafana — dashboards, datasources, alertas e projeto local

## Introdução

**Grafana** é uma plataforma **open source** (e oferta **Grafana Cloud**) para **visualizar métricas, logs e traces** a partir de múltiplas fontes de dados. Complementa o estudo [Prometheus e observabilidade](../prometheus-observabilidade/README.md): em muitos ambientes, o **Prometheus** coleta e armazena séries temporais e o **Grafana** consulta via **PromQL** e renderiza painéis; o mesmo Grafana agrega **Loki** (logs), **Tempo** (traces) e bancos como **PostgreSQL**, **CloudWatch**, **Azure Monitor**.

Este capítulo aprofunda **como subir um ambiente de laboratório**, **modelar um projeto** com provisionamento em Git e **operar alertas** com diagramas que você pode reutilizar em documentação ou onboarding.

```mermaid
flowchart TB
  subgraph grafana[Grafana]
    D[Dashboards]
    A[Alerting]
    E[Explore]
  end
  DS1[(Prometheus)]
  DS2[(Loki)]
  DS3[(Tempo)]
  DS4[(CloudWatch)]
  grafana --> DS1
  grafana --> DS2
  grafana --> DS3
  grafana --> DS4
```

---

## Conceitos principais

| Conceito | Descrição |
|----------|-----------|
| **Data source** | Conexão a um backend (URL, credenciais, *timeout*) |
| **Dashboard** | Coleção de painéis; JSON exportável (GitOps) |
| **Panel** | Query + visualização (time series, stat, table, heatmap) |
| **Variable** | Filtro dinâmico (`$instance`, `$namespace`) |
| **Folder / RBAC** | Organização e permissões (Grafana OSS vs Enterprise) |

---

## Projeto local: Docker Compose com Prometheus + Grafana

Um **projeto mínimo** ajuda a praticar datasources, painéis e alertas sem depender de cluster corporativo. A ideia é: **Prometheus** raspa uma aplicação de exemplo (ou `prometheus` auto-monitorado) e o **Grafana** consome a mesma rede Docker.

### Estrutura de pastas sugerida

```text
grafana-lab/
├── docker-compose.yml
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasources.yaml
│   │   └── dashboards/
│   │       └── dashboards.yaml
│   └── dashboards/
│       └── api-overview.json
└── README.md
```

### `docker-compose.yml` (referência)

```yaml
services:
  prometheus:
    image: prom/prometheus:v2.53.0
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - "9090:9090"
    networks: [obs]

  grafana:
    image: grafana/grafana:11.3.0
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
      GF_USERS_DEFAULT_THEME: dark
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - ./grafana/dashboards:/var/lib/grafana/dashboards:ro
    ports:
      - "3000:3000"
    depends_on: [prometheus]
    networks: [obs]

networks:
  obs:
    driver: bridge
```

### `prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["prometheus:9090"]
```

### Provisionamento do datasource (`grafana/provisioning/datasources/datasources.yaml`)

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
```

### Provisionamento de dashboards (`grafana/provisioning/dashboards/dashboards.yaml`)

```yaml
apiVersion: 1
providers:
  - name: default
    folder: Lab
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

Suba com `docker compose up -d` e acesse **http://localhost:3000** (usuário/senha conforme variáveis). O Prometheus fica em **http://localhost:9090** para validar *targets* antes de montar painéis.

```mermaid
flowchart LR
  subgraph host[Host desenvolvimento]
    B[Browser]
  end
  B -->|3000| GF[Grafana]
  GF -->|PromQL HTTP| PR[Prometheus]
  PR -->|scrape| PR
```

---

## Primeiro dashboard no laboratório

1. Em **Connections → Data sources**, confirme **Prometheus** (provisionado).
2. **Dashboards → New → New dashboard → Add visualization**.
3. Escolha **Time series** e uma query simples: `prometheus_tsdb_head_series` ou `up`.
4. Salve o dashboard na pasta **Lab** (coerente com o *provider* acima).

Para **GitOps**, exporte o JSON (**Share → Export**) para `grafana/dashboards/` e versione no repositório.

```mermaid
sequenceDiagram
  participant U as Usuário
  participant G as Grafana
  participant P as Prometheus
  U->>G: Abre painel / refresh
  G->>P: GET /api/v1/query_range
  P-->>G: Matriz de samples
  G-->>U: Renderiza time series
```

---

## Variáveis e reutilização

Variáveis de dashboard (`Settings → Variables`) permitem um único JSON servir **vários ambientes** ou **instâncias**:

- Tipo **Query** em Prometheus: `label_values(up, job)` para lista de *jobs*.
- Use `$job` na expressão: `rate(http_requests_total{job="$job"}[5m])`.

Isso reduz duplicação e evita “copiar e colar” de painéis por time.

---

## Provisionamento como código (visão geral)

Evite configurar tudo só pela UI em produção: use **provisioning** com arquivos YAML apontando para dashboards em disco ou URLs, e **datasources** versionados. Isso permite **review** em PR e **rollback** previsível.

```mermaid
flowchart LR
  GIT[Git repo] --> CI[CI / sync]
  CI --> GR[Grafana provisioning]
  GR --> UI[Dashboards ativos]
```

---

## Alerting (Grafana 8+)

O motor unificado de alertas permite regras **baseadas em dados Grafana** (Prometheus, Loki, etc.) com **rotas** para **Contact points** (Slack, PagerDuty, webhook). Separe:

- **Threshold** em painel (rápido para protótipo) vs **alert rule** centralizada (melhor governança).
- **For** (*pending period*) para reduzir flapping.

Para stacks só Prometheus, muitos times ainda usam **Alertmanager** para roteamento e **Grafana** só para visualização — as duas abordagens coexistem; documente qual é **fonte da verdade** para *silence* e *on-call*.

```mermaid
stateDiagram-v2
  [*] --> Normal
  Normal --> Pending: condição verdadeira
  Pending --> Firing: duração > for
  Pending --> Normal: condição falsa
  Firing --> Normal: recuperação
  Firing --> Notified: contact point
```

---

## Boas práticas de dashboard

- **Poucos painéis críticos** por tela SLO; detalhe em *drill-down*.
- **Unidades e legendas** explícitas (`s`, `req/s`, `%`).
- **Templates** por ambiente (`dev`/`stg`/`prod`) via variáveis.
- **Performance:** limite *time range* padrão; evite `high cardinality` em labels usados em legendas.

---

## API HTTP do Grafana

Automatize importação de dashboards ou gestão de pastas com a **HTTP API** (token de serviço ou API key).

### JavaScript (Node — fetch)

```javascript
import fs from "fs";

const BASE = process.env.GRAFANA_URL;
const KEY = process.env.GRAFANA_TOKEN;

async function importDashboard(jsonPath) {
  const body = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const res = await fetch(`${BASE}/api/dashboards/db`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dashboard: body, overwrite: true }),
  });
  if (!res.ok) throw new Error(await res.text());
}

await importDashboard("./dashboards/api-overview.json");
```

### Python

```python
import json
import os
import urllib.request

def import_dashboard(path: str) -> None:
    base = os.environ["GRAFANA_URL"].rstrip("/")
    token = os.environ["GRAFANA_TOKEN"]
    payload = {"dashboard": json.load(open(path)), "overwrite": True}
    req = urllib.request.Request(
        f"{base}/api/dashboards/db",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as r:
        assert r.status == 200

import_dashboard("dashboards/api-overview.json")
```

### C# (HttpClient)

```csharp
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

await using var fs = File.OpenRead("dashboards/api-overview.json");
var dash = JsonDocument.Parse(fs).RootElement;
var payload = JsonSerializer.Serialize(new { dashboard = dash, overwrite = true });
using var client = new HttpClient { BaseAddress = new Uri(Environment.GetEnvironmentVariable("GRAFANA_URL")!) };
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", Environment.GetEnvironmentVariable("GRAFANA_TOKEN"));
var res = await client.PostAsync("/api/dashboards/db", new StringContent(payload, Encoding.UTF8, "application/json"));
res.EnsureSuccessStatusCode();
```

### Go (cliente mínimo)

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	base := os.Getenv("GRAFANA_URL")
	token := os.Getenv("GRAFANA_TOKEN")
	raw, _ := os.ReadFile("dashboards/api-overview.json")
	var dash map[string]any
	json.Unmarshal(raw, &dash)
	body, _ := json.Marshal(map[string]any{"dashboard": dash, "overwrite": true})
	req, _ := http.NewRequest(http.MethodPost, base+"/api/dashboards/db", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		panic(fmt.Errorf("grafana: %s", res.Status))
	}
}
```

### Spring Boot (WebClient — cliente administrativo)

```java
@Service
public class GrafanaAdminClient {
  private final WebClient webClient;

  public GrafanaAdminClient(
      @Value("${grafana.url}") String base,
      @Value("${grafana.token}") String token) {
    this.webClient = WebClient.builder()
        .baseUrl(base)
        .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .build();
  }

  public Mono<String> importDashboard(JsonNode dashboard) {
    var body = Map.of("dashboard", dashboard, "overwrite", true);
    return webClient.post()
        .uri("/api/dashboards/db")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(body)
        .retrieve()
        .bodyToMono(String.class);
  }
}
```

---

## Explore e correlação

O modo **Explore** permite testar **PromQL**, **LogQL** (Loki) e consultar **traces** sem fixar painel — útil em incidentes. Combine **trace_id** nos logs da aplicação (ver [Logs de aplicação](../logs-aplicacao/01-levels-e-boas-praticas.md)) com **Tempo** ou backend equivalente para saltar de métrica → log → trace.

---

## Segurança

- **OAuth2 / SSO** para acesso humano; **API keys** com escopo mínimo para automação.
- **Datasource credentials** em Secret Manager / Vault, não em texto no JSON do dashboard.
- **Network policies** em Kubernetes entre Grafana e Prometheus/Loki.

---

## Checklist de impressão / revisão

| Passo | O que validar |
|-------|----------------|
| 1 | `docker compose` sobe sem erros de volume |
| 2 | Datasource Prometheus “green” na UI |
| 3 | Dashboard provisionado aparece na pasta **Lab** |
| 4 | Query de teste retorna dados no Explore |
| 5 | Script de API importa JSON com token de serviço |

---

## Referências

- Grafana: *Provisioning*, *Alerting*, *HTTP API*.
- Estudos relacionados neste repositório: Prometheus, logs de aplicação.

---

*Grafana é **camada de consumo** da observabilidade: investir em **datasources confiáveis** e **alertas com contexto** vale mais que dezenas de gráficos redundantes.*
