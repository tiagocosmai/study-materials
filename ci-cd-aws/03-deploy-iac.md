# Deploy e infraestrutura como código

## CodeDeploy e destinos

**CodeDeploy** implanta o artefato (código ou referência de imagem) no destino configurado:

- **EC2 / On-Premises** – Instâncias em um deployment group; revisão = bundle no S3 (código) ou definição de tarefa (para ECS). Estratégia: rolling, all-at-once ou custom.
- **ECS** – Deployment de um serviço ECS; a revisão é um arquivo `imagedefinitions.json` com a nova imagem (ex.: produzida pelo CodeBuild). CodeDeploy atualiza o serviço ECS (rolling ou blue/green com o recurso nativo do ECS).
- **Lambda** – Atualiza a função com novo código (zip no S3 ou direto); pode ser feito também por pipeline com ação “Invoke” ou atualização de stack CloudFormation.

O **CodePipeline** tem uma ação “Deploy” que chama o CodeDeploy; o artefato de entrada é o output do estágio anterior (ex.: imagedefinitions.json do Build).

## ECS e Lambda na pipeline

- **ECS** – O estágio Deploy usa o provider “Amazon ECS” na ação do CodePipeline: você informa cluster, serviço e o arquivo de definição de imagem (imagedefinitions.json). O pipeline atualiza o serviço com a nova imagem; o ECS faz rolling update (ou blue/green se configurado).
- **Lambda** – O estágio Deploy pode usar a ação “AWS Lambda” do CodePipeline: o artefato é um zip da função; o pipeline atualiza a versão da função. Alternativa: usar CloudFormation/SAM para atualizar a função (infraestrutura como código).

## Infraestrutura como código (IaC)

A infraestrutura (VPC, ECS cluster, tarefas, Lambda, IAM) pode ser definida em código e aplicada na pipeline:

- **AWS CloudFormation** – Templates YAML/JSON; o pipeline pode ter um estágio “Deploy” que executa `aws cloudformation create-stack` ou `update-stack` com o template (em S3 ou no repositório). Mudanças na infra passam por revisão (PR) e deploy controlado.
- **AWS SAM** – Extensão do CloudFormation para Lambda e APIs; `sam build` e `sam deploy` podem rodar no CodeBuild; o artefato é o template empacotado.
- **Terraform** – Executado no CodeBuild (terraform init, plan, apply); state no S3 com lock (DynamoDB). O pipeline pode ter aprovação manual antes do apply em produção.

Benefício: ambiente reproduzível, auditoria e rollback (reverter o template) alinhados ao Git.

## Ambientes e aprovação

- **Estágios do pipeline** – Ex.: Build → Deploy-Staging (automático) → Aprovação manual → Deploy-Production. O artefato é o mesmo; apenas o destino e as variáveis mudam.
- **Aprovação** – Ação “Manual approval” no CodePipeline; um aprovador confirma antes de seguir para produção.
- **Ambientes** – Em CodePipeline, “Environments” podem ser vinculados a um deployment group (CodeDeploy) ou a uma conta/região; útil para cross-account deploy.

## Boas práticas

- **Imutabilidade** – Novas versões = nova imagem ou novo revisão; não alterar configuração “no servidor” fora do pipeline.
- **Rollback** – Manter versões anteriores da imagem no ECR; reverter o serviço ECS para uma task definition anterior em caso de falha. No CodeDeploy para EC2, rollback automático em falha de health check.
- **Secrets** – Não colocar segredos no código nem no buildspec em texto claro; usar Parameter Store ou Secrets Manager e acessar pela role do CodeBuild/CodeDeploy.
- **Logs** – CodeBuild e CodeDeploy escrevem logs no CloudWatch; centralizar e reter para diagnóstico.

Com isso, você tem uma visão de **integração e implantação contínuas na AWS**: fonte (GitHub/CodeCommit), build (CodeBuild), artefatos (S3, ECR) e deploy (CodeDeploy, ECS, Lambda), com opção de IaC (CloudFormation, Terraform) na própria pipeline.

---

*Voltar ao [índice](./README.md).*
