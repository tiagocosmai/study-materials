# Pipeline: build, teste e artefatos

## Projeto CodeBuild

Um **projeto CodeBuild** define:

- **Fonte** – Geralmente “CodePipeline” (a fonte é a do pipeline) ou direto de CodeCommit/GitHub/S3.
- **Ambiente** – Imagem de build (AWS padrão ou customizada no ECR); tipo de compute (small, medium, large); variáveis de ambiente (incluindo secrets do Parameter Store ou Secrets Manager).
- **Buildspec** – Comandos em YAML (install, pre_build, build, post_build) ou arquivo `buildspec.yml` no repositório. O CodeBuild executa em um container; o código é clonado no início.

Exemplo mínimo de **buildspec.yml** (Node.js, testes e build):

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci
  pre_build:
    commands:
      - npm run lint
  build:
    commands:
      - npm test
      - npm run build
  post_build:
    commands:
      - echo "Build completed"
artifacts:
  files:
    - '**/*'
  base-directory: dist
cache:
  paths:
    - node_modules/**/*
```

O pipeline passa o código (output do estágio Source) como input do CodeBuild; o CodeBuild produz **artefatos** (arquivos ou diretórios) que são enviados ao bucket de artefatos do pipeline para o próximo estágio.

## Build de imagem Docker e push no ECR

Para aplicações containerizadas:

1. O **buildspec** usa `docker build` e `docker push`; o ambiente CodeBuild já tem Docker instalado.
2. O CodeBuild faz **login** no ECR (`aws ecr get-login-password | docker login ...`), faz **build** da imagem (tag com URI do repositório ECR e tag como commit ID ou latest) e **push** para o ECR.
3. A role do CodeBuild precisa de permissão `ecr:GetAuthorizationToken` e `ecr:BatchCheckLayerUpload`, `ecr:PutImage`, `ecr:InitiateLayerUpload`, etc., no repositório ECR.
4. O **artefato** do estágio Build pode ser o arquivo `imagedefinitions.json` (formato usado pelo deploy para ECS) com o URI da imagem e tag; o estágio Deploy do pipeline usa esse arquivo para atualizar o serviço ECS.

Exemplo de trecho de buildspec para Docker + ECR:

```yaml
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI
      - IMAGE_TAG=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
  build:
    commands:
      - docker build -t $ECR_URI:$IMAGE_TAG .
      - docker push $ECR_URI:$IMAGE_TAG
      - echo '[{"name":"container-name","imageUri":"'$ECR_URI':'$IMAGE_TAG'"}]' > imagedefinitions.json
artifacts:
  files: imagedefinitions.json
```

## Testes no pipeline

- **Unitários** – Rodar no CodeBuild (npm test, pytest, go test); falha do comando falha o build.
- **Integração** – Se precisar de dependências (DB, Redis), usar rede VPC no CodeBuild ou serviços em ambiente de teste (RDS, ElastiCache em VPC); ou rodar em estágio separado com ambiente pré-provisionado.
- **Segurança** – CodeBuild pode rodar SAST (SonarQube, Semgrep), SCA (npm audit, Snyk) e scan de imagem (Trivy, ECR image scanning); falhar o build se houver vulnerabilidade crítica.
- **Cobertura** – Publicar relatório de cobertura em artefato ou em S3; integrar com CodeGuru ou ferramenta externa.

## Cache e desempenho

- **Cache do CodeBuild** – Cache local (paths no buildspec) ou S3; reduz tempo de build ao reutilizar node_modules, .m2, etc.
- **Docker layer cache** – Em build de imagem, usar cache do Docker (cache de layers no ECR ou em S3) para acelerar builds subsequentes.

## Resumo

| Tema | Prática |
|------|---------|
| **Buildspec** | Definir install, test, build e artefatos; usar cache quando possível. |
| **Docker + ECR** | Login ECR, build, push, gerar imagedefinitions.json para ECS. |
| **Testes** | Unitários no build; integração com VPC ou estágio dedicado. |
| **Segurança** | SAST, SCA, scan de imagem; falhar build em crítica. |

No próximo capítulo: CodeDeploy, deploy em ECS/Lambda/EC2 e uso de CloudFormation/Terraform na pipeline.

---

*Próximo: [Deploy e infraestrutura como código](./03-deploy-iac.md).*
