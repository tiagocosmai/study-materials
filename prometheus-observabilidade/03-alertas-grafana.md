# Alertas, Grafana e boas práticas

## Regras de alerta

No Prometheus, **alerting rules** são expressões PromQL que, quando avaliadas como “true” por um tempo (for clause), geram um **alert** que é enviado ao **Alertmanager**. Exemplo:

```yaml
groups:
  - name: api
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.instance }}"
```

- **expr** – PromQL; se retornar série(s), o alerta está “firing”.
- **for** – Duração em que a condição deve ser verdadeira antes de enviar.
- **labels / annotations** – Metadados para roteamento e mensagem no Alertmanager.

Boas práticas: alertar sobre sintomas (erro alto, latência alta, SLO violado), não apenas “métrica X passou de Y”; evitar alertas que disparam demais (ruído) ou que nunca disparam (configuração errada).

## Alertmanager

O **Alertmanager** recebe alertas do Prometheus, agrupa, deduplica e roteia para **receivers** (Slack, PagerDuty, e-mail, webhook). Configuração típica:

- **Route** – Árvore de rotas por labels (severity, team); cada rota pode ter um receiver e sub-rotas.
- **Inhibition** – Um alerta pode suprimir outro (ex.: “cluster down” suprime alertas de instância).
- **Silence** – Silenciar alertas por um período (manutenção).
- **Grouping** – Agrupar vários alertas em uma notificação para não bombardear o canal.

Assim, o time recebe notificações acionáveis e evita fadiga de alertas.

## Grafana

**Grafana** é uma ferramenta de **visualização**: conecta ao Prometheus (e outros datasources) como fonte de dados, permite criar **dashboards** com gráficos (time series, gauge, table) usando PromQL (ou a query builder). Recursos:

- **Dashboard** – Painéis com queries PromQL; variáveis para filtrar (namespace, pod, job).
- **Alerting** – Grafana pode avaliar regras e notificar (ou você mantém alertas no Prometheus/Alertmanager).
- **Explore** – Modo para testar PromQL e explorar métricas.

Dashboards bem desenhados mostram RED/USE, SLO e saúde do sistema em um glance; úteis para troubleshooting e revisão pós-incidente.

## Boas práticas de observabilidade

- **Métricas de aplicação** – Instrumentar requests (total, por status, por path), latência (histogram) e erros; usar labels estáveis (evitar high cardinality: não usar user_id em label se houver milhões de usuários).
- **Cardinalidade** – Número de séries = combinações de labels; labels com muitos valores (IDs) explodem o armazenamento; preferir métricas agregadas ou logs para detalhe por entidade.
- **SLO e error budget** – Definir SLO (ex.: 99,9% disponibilidade), expor métricas que permitam calcular “erro orçamento” e alertar quando o orçamento está esgotado.
- **Runbooks** – Alertas devem ter link ou texto para runbook (o que fazer quando o alerta dispara); reduz tempo de resolução.
- **Retenção** – Prometheus retém dados por um período (ex.: 15 dias); para longo prazo, usar remote write (ex.: Thanos, Cortex, AWS Managed Prometheus) ou agregar e arquivar.

Com isso, você tem uma visão de **monitoramento e observabilidade com Prometheus**: modelo de métricas, coleta e exportadores, PromQL, alertas com Alertmanager e dashboards com Grafana, alinhados a RED/USE e SLO.

---

*Voltar ao [índice](./README.md).*
