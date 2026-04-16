# Conceitos: variáveis de ambiente, arquivos e externalização

## Introdução

**Configuração** é tudo o que pode variar entre deploys (URLs de API, tamanho de pool, *feature flags*). **Segredos** são um subconjunto (senhas, tokens, chaves privadas) que exige **confidencialidade** e **auditoria**. Misturar os dois no código-fonte viola o princípio de **externalização** e dificulta **rotação** e **compliance**.

```mermaid
flowchart TB
  subgraph bom[Boas práticas]
    CODE[Código: sem segredos]
    CFG[Config: env / arquivos montados]
    SEC[Segredos: store + injeção runtime]
  end
  CODE --> RUN[Container / processo]
  CFG --> RUN
  SEC --> RUN
```

---

## Twelve-Factor: *Config*

O [factor *Config*](https://12factor.net/config) afirma que configuração deve ficar no **ambiente**, não em constantes no repositório. Na prática moderna isso inclui:

- **Variáveis de ambiente** (`export`, `docker run -e`, `env` no Kubernetes).
- **Arquivos montados** por orquestrador ou sidecar (volume com `.env` **não** commitado).
- **Stores** (Vault, Secret Manager) com **injeção** em bootstrap ou sidecar.

```mermaid
flowchart LR
  subgraph anti[Evitar]
    H1[Constants com URL prod]
    H2[.env commitado com API key]
  end
  subgraph ok[Preferir]
    P1[ENV ou mount]
    P2[Reference a secret ID]
  end
```

---

## Camadas de precedência (padrão comum)

Muitas aplicações resolvem config nesta ordem (última vence):

1. **Defaults** seguros no código (apenas não-secretos).
2. **Arquivo** opcional (`appsettings.json`, `application.yml`).
3. **Variáveis de ambiente** (maiúsculas, prefixo `APP_`).
4. **Argumentos de linha de comando** (flags).

```mermaid
flowchart TB
  D[Defaults] --> F[Arquivo local]
  F --> E[Variáveis de ambiente]
  E --> A[CLI flags]
```

### Node.js — ordem manual ilustrativa

```javascript
function loadConfig() {
  const base = { port: 3000, logLevel: "info" };
  const fromEnv = {
    port: process.env.PORT ? Number(process.env.PORT) : base.port,
    logLevel: process.env.LOG_LEVEL ?? base.logLevel,
  };
  return { ...base, ...fromEnv };
}
```

### Python — `os.environ` com default

```python
import os

def load_config() -> dict:
    return {
        "port": int(os.environ.get("PORT", "3000")),
        "log_level": os.environ.get("LOG_LEVEL", "info"),
    }
```

### Java — Spring Boot (`application.yml` + override)

O Spring aplica **profiles** e **env vars** com relax binding (`SERVER_PORT` → `server.port`).

```yaml
# application.yml (sem segredos)
server:
  port: 8080
```

### C# — `ConfigurationBuilder`

```csharp
var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables(prefix: "MYAPP_")
    .Build();
var port = config.GetValue<int>("PORT", 5000);
```

### Go — `envconfig` pattern (manual)

```go
package main

import (
	"os"
	"strconv"
)

type Config struct {
	Port int
}

func Load() Config {
	p, _ := strconv.Atoi(getenv("PORT", "8080"))
	return Config{Port: p}
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
```

---

## `.env` em desenvolvimento

Ferramentas como **dotenv** carregam `.env` **apenas em dev**; o ficheiro deve estar no **`.gitignore`**.

```bash
# .env.example (versionado — sem valores reais)
PORT=3000
DATABASE_URL=postgres://user:CHANGE_ME@localhost:5432/app
```

```mermaid
flowchart LR
  EX[.env.example] -->|copiar| DEV[.env local]
  DEV -->|gitignore| GIT[Repositório limpo]
```

---

## *Feature flags* vs config estática

**Flags** mudam comportamento sem redeploy completo; podem vir de **Consul KV**, **LaunchDarkly**, **Unleash** ou **ConfigMap** com *reload*. Separe **segredos** de **flags públicas internamente**.

---

## Checklist de revisão

| Item | Pergunta |
|------|----------|
| Segredos | Há chave ou password no Git? |
| Defaults | Produção sobrescreve tudo crítico? |
| Rotação | O segredo pode ser trocado sem rebuild de imagem? |
| Auditoria | Quem leu o secret em produção? |

---

## Próximo capítulo

[HashiCorp Vault](./02-hashicorp-vault.md) — armazenamento dinâmico de segredos e políticas.

---

*Trate **config** como dado operacional e **secret** como ativo sensível — pipelines e políticas diferentes para cada um.*
