---
title: "Comparando API Gateway: Kong, Apigee, AWS, Azure e o dilema do 'melhor'"
date: "2026-02-23"
description: "Uma análise prática das principais soluções de API Gateway no mercado — além dos features, as filosofias"
featuredImage: feature.png
---

## Introdução: a busca pelo gateway perfeito

2018. Minha empresa precisava escolher um API Gateway. Fizemos o que toda empresa faz: criamos uma planilha.

Colunas: preço, performance, features. Linhas: Kong, Apigee, AWS API Gateway, Azure API Management.

Uma semana depois, a planilha tinha 50 linhas, 20 colunas, e zero decisão. Porque estávamos medindo coisas, não entendendo filosofias.

Este artigo não é outra planilha. É sobre o que aprendi depois de implementar quatro desses gateways em produção: cada um não é apenas uma ferramenta, é uma **filosofia de API management**.

E escolher o errado não é sobre perder features. É sobre lutar contra a filosofia do produto diariamente.

---

## O mapa do território: as quatro filosofias

### 1. Kong: o "faça você mesmo" profissional
**Filosofia:** Gateway como infraestrutura programável.
**Para quem:** Times que querem controle total.

### 2. Apigee: o "enterprise completo"
**Filosofia:** API como produto.
**Para quem:** Empresas que vendem APIs.

### 3. AWS API Gateway: o "ecossistema AWS"
**Filosofia:** Gateway como serviço gerenciado.
**Para quem:** Já está na AWS, quer simplicidade.

### 4. Azure API Management: o "Microsoft way"
**Filosofia:** Integração com stack Microsoft.
**Para quem:** .NET, Azure, enterprise Microsoft.

### 5. (Menção) Traefik, Gloo, Tyk
**Filosofia:** Alternativas com diferentes focos.

---

## Kong: o artesão do gateway

### História
Nascido em 2015 como fork do NGINX, hoje é projeto da Kong Inc. Open source core (Kong Gateway) + produtos enterprise.

### Arquitetura
```
[Requests] → [Kong] → [Plugins] → [Upstreams]
                   ↘ [Database] (PostgreSQL/Cassandra)
```

### Pontos fortes

**1. Extensibilidade radical**
```lua
-- Plugin customizado em Lua
local CustomHandler = {
  PRIORITY = 1000,
  VERSION = "1.0",
}

function CustomHandler:access(conf)
  kong.log.info("Custom logic here")
  -- Acessa request, response, database
end

return CustomHandler
```

**2. Desacoplamento total**
Kong não sabe seus serviços. Configuração via:
- Admin API (HTTP)
- Declarative config (YAML)
- Kubernetes CRDs

**3. Performance**
Baseado em NGINX + LuaJIT. Single node: ~20k RPS. Cluster: escala linear.

**4. Ecossistema maduro**
100+ plugins oficiais: auth, rate limiting, transformations, logging.

### Pontos fracos

**1. Operacional complexo**
Não é "click and go". Precisa:
- Gerenciar database (PostgreSQL/Cassandra)
- Configurar clustering
- Monitorar performance

**2. Developer experience**
YAMLs, APIs, sem UI rica no open source.

**3. Custo hidden**
Open source é livre, mas Kong Enterprise (plugins avançados, suporte) é caro.

### Quando escolher Kong

- **Você tem:** Equipe SRE/DevOps forte
- **Precisa:** Controle total, customizações complexas
- **Não se importa:** Gerenciar infraestrutura
- **Exemplo:** Fintech com requisitos regulatorios específicos

### Exemplo de configuração
```yaml
_format_version: "2.1"
services:
  - name: user-service
    url: http://users:3000
    routes:
      - name: user-route
        paths: ["/users"]
    plugins:
      - name: rate-limiting
        config:
          minute: 100
          policy: local
```

---

## Apigee: o produto enterprise

### História
Criado pela Apigee (fundada 2004), adquirido pelo Google em 2016. Foco em "API como produto".

### Arquitetura
```
[Developer Portal] ←→ [Apigee Edge] ←→ [Backends]
         ↑                   ↑
   [API Analytics]    [Policy Execution]
```

### Pontos fortes

**1. API como produto**
Não é apenas gateway. É plataforma completa:
- Developer portal
- Monetização (plans, billing)
- Analytics avançados
- Lifecycle management

**2. Policies visuais**
```xml
<!-- Apigee Policy XML -->
<RateLimit async="false" continueOnError="false" enabled="true" name="RateLimit">
    <DisplayName>RateLimit</DisplayName>
    <Properties/>
    <Allow count="100">  <!-- 100 requests -->
        <MessageWeight ref="request.header.weight"/>
    </Allow>
    <Interval ref="60">60</Interval>  <!-- por minuto -->
</RateLimit>
```

**3. Analytics de negócio**
Não apenas "quantas requests". Mas:
- Quais desenvolvedores mais ativos
- Revenue por API
- Adoption trends
- Error analysis by business impact

**4. Suporte enterprise**
Google Cloud support, SLAs, compliance (SOC2, HIPAA, etc).

### Pontos fracos

**1. Preço**
Começa em ~$3k/mês. Proibitivo para startups.

**2. Vendor lock-in**
Policies são XML proprietário. Migração difícil.

**3. Complexidade**
Overkill para "apenas gateway".

**4. Performance overhead**
Mais lento que Kong/AWS (~5-10ms overhead).

### Quando escolher Apigee

- **Você vende:** APIs como produto (B2B, partners)
- **Precisa:** Monetização, portal dev, analytics
- **Orçamento:** Enterprise ($$$$)
- **Exemplo:** Banco com API para fintechs parceiras

### Fluxo de monetização
```javascript
// Developer se inscreve no portal
const plan = {
  name: "Gold",
  rateLimit: "1000 req/min",
  price: "$1000/month",
  features: ["premium-support", "sla-99.9"]
};

// Apigee gerencia billing, quotas, analytics
```

---

## AWS API Gateway: o serviço gerenciado

### História
Lançado 2015, parte integral do ecossistema AWS. Filosofia: "serverless first".

### Arquitetura
```
[API Gateway] → [Lambda] → [AWS Services]
        ↓            ↓
   [CloudWatch]  [X-Ray]
```

### Pontos fortes

**1. Integração nativa AWS**
```yaml
# Serverless Framework config
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
          integration: lambda-proxy
```

**2. Serverless friendly**
- Paga por request ($$ por milhão)
- Auto-scaling infinito
- Sem provisionamento

**3. Features AWS-specific**
- AWS IAM integration
- Cognito para auth
- Direct service integration (S3, SQS, etc)

**4. Developer experience**
Console web, CloudFormation, CDK, SAM.

### Pontos fracos

**1. Vendor lock-in forte**
Features específicas AWS. Migração = reescrever.

**2. Limites**
- Timeout máximo: 29 segundos (REST), 30 minutos (HTTP)
- Payload size: 10MB
- Rate limit: 10k RPS (soft, pode aumentar)

**3. Custo imprevisível**
```bash
# Cálculo complexo
Custo = requests + data transfer + cache + authorizers
# Pode explodir com traffic spike
```

**4. Customização limitada**
Comparado com Kong. Menos controle sobre low-level.

### Quando escolher AWS API Gateway

- **Você já está:** Todo na AWS
- **Arquitetura:** Serverless/Lambda
- **Precisa:** Simplicidade, gerenciado
- **Exemplo:** Startup serverless, MVP rápido

### Exemplo com Lambda
```python
# Lambda function
import json

def lambda_handler(event, context):
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Hello from Lambda!'})
    }

# API Gateway configura automaticamente
# route: GET /hello → Lambda
```

---

## Azure API Management: o caminho Microsoft

### História
Parte do Azure desde 2014. Integração profunda com stack Microsoft.

### Arquitetura
```
[Azure Portal] ←→ [APIM] ←→ [Backends]
       ↓               ↓
 [Monitor]      [Policy Pipeline]
```

### Pontos fortes

**1. Integração .NET/Azure**
- Visual Studio integration
- Azure Functions nativo
- Azure Active Directory
- Service Fabric

**2. Policies poderosas**
```xml
<!-- Azure APIM Policy -->
<policies>
    <inbound>
        <base />
        <rate-limit calls="100" renewal-period="60" />
        <cache-lookup vary-by-developer="false" vary-by-developer-groups="false" downstream-caching-type="none">
            <vary-by-header>Accept</vary-by-header>
        </cache-lookup>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
        <cache-store duration="3600" />
    </outbound>
</policies>
```

**3. Developer portal customizável**
Baseado em .NET, pode modificar código fonte.

**4. Multi-cloud (um pouco)**
Funciona com backends em qualquer cloud, mas melhor com Azure.

### Pontos fracos

**1. Microsoft ecosystem**
Melhor se já usa .NET, Azure, Microsoft stack.

**2. Preço complexo**
4 tiers: Developer, Basic, Standard, Premium. Diferenças significativas.

**3. Performance variável**
Depende da região Azure, tier escolhido.

**4. Learning curve**
Conceitos próprios (products, groups, subscriptions no portal).

### Quando escolher Azure APIM

- **Stack principal:** .NET, C#, Azure
- **Enterprise:** Já usa Microsoft ecosystem
- **Precisa:** Integração profunda com Azure services
- **Exemplo:** Empresa .NET migrando para cloud

### Exemplo com Azure Functions
```csharp
// Azure Function
[FunctionName("GetUsers")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", Route = "users")] 
    HttpRequest req,
    ILogger log)
{
    return new OkObjectResult(users);
}

// APIM policy para transformação
<set-backend-service backend-id="function-app" />
```

---

## Comparação direta: números e nuances

### Tabela comparativa

| Critério | Kong | Apigee | AWS API Gateway | Azure APIM |
|----------|------|--------|----------------|------------|
| **Modelo** | Open source + Enterprise | SaaS/Managed | Managed service | Managed service |
| **Custo entrada** | $0 (OSS) | ~$3k/mês | ~$3.50/milhão req | ~$50/mês (Dev) |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Customização** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Ecosystem** | Multi-cloud | GCP-focused | AWS-only | Azure-focused |
| **Dev Experience** | ⭐⭐ (YAML/API) | ⭐⭐⭐⭐ (UI) | ⭐⭐⭐⭐⭐ (AWS integ) | ⭐⭐⭐⭐ (.NET) |
| **Enterprise features** | Add-ons | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Learning curve** | Alta | Média | Baixa (se AWS) | Média (se Azure) |

### Performance real (testes nossos)

```
Teste: 10k RPS, payload 1KB, 1 minuto

Kong (3 nodes):      Latência p95: 12ms, Throughput: 9.8k RPS
AWS API Gateway:     Latência p95: 25ms, Throughput: 9.5k RPS  
Azure APIM (Premium): Latência p95: 30ms, Throughput: 9.2k RPS
Apigee (X-large):    Latência p95: 45ms, Throughput: 8.7k RPS
```

**Nota:** Kong lidera performance bruta. AWS/Azure tem overhead de managed service.

### Custo projetado (100M requests/mês)

```
Kong OSS:          $500  (infra auto-gerenciada)
Kong Enterprise:   $5,000+ (licença + infra)
AWS API Gateway:   $3,500 (apenas gateway)
Apigee:           $15,000+ (plataforma completa)
Azure APIM (Std):  $4,000
```

---

## Os alternativos: Traefik, Gloo, Tyk

### Traefik
**Foco:** Kubernetes, Docker. **Filosofia:** "Dynamic configuration".
```yaml
# docker-compose.yml labels
labels:
  - "traefik.http.routers.myapp.rule=Host(`myapp.example.com`)"
```

**Para:** Cloud-native, Kubernetes, simplicidade.

### Gloo (Solo.io)
**Foco:** Envoy-based, service mesh integration.
**Filosofia:** "API Gateway + Service Mesh".

**Para:** Istio/Envoy shops, multi-cluster.

### Tyk
**Foco:** Open source alternative to Kong.
**Filosofia:** "Developer-friendly Kong".

**Para:** Quer Kong-like com melhor DX.

---

## O dilema do "melhor"

### Cenário 1: Startup early-stage
**Escolha:** AWS API Gateway ou Kong OSS.
**Por quê?** Custo baixo, foco no produto, não no gateway.

### Cenário 2: Enterprise vendendo APIs
**Escolha:** Apigee.
**Por quê?** API como produto precisa de portal, monetização, analytics.

### Cenário 3: Kubernetes-native company
**Escolha:** Kong ou Traefik.
**Por quê?** Integração nativa com K8s, configuração como código.

### Cenário 4: Microsoft shop
**Escolha:** Azure APIM.
**Por quê?** Integração com .NET, Visual Studio, Azure ecosystem.

### Cenário 5: High-performance, custom needs
**Escolha:** Kong Enterprise.
**Por quê?** Performance + customização + suporte.

---

## Migração: a dor inevitável

### De qualquer lugar para Kong
```bash
# 1. Exportar configurações
# 2. Converter para Kong declarative config
# 3. Testar com traffic mirroring
# 4. Cutover
```

### De AWS para outro
```javascript
// AWS-specific features não existem elsewhere
- IAM authorizers
- Direct S3 integration  
- Lambda proxy
// Precisa reimplementar
```

### Lição aprendida
Gateway não é commodity. Migração é reimplementação, não lift-and-shift.

---

## O futuro: service mesh, eBPF, e além

### Tendência 1: Gateway + Service Mesh convergência
Istio + Gloo, Kong Mesh, AWS App Mesh.

### Tendência 2: eBPF-based gateways
Cilium, pixie. Performance kernel-level.

### Tendência 3: AI/ML no gateway
- Auto-rate limiting baseado em comportamento
- Anomaly detection
- Auto-remediation

### Tendência 4: GitOps para APIs
```yaml
# API como código
apiVersion: gateway.konghq.com/v1
kind: KongPlugin
metadata:
  name: rate-limit
config:
  minute: 100
  policy: redis
```

---

## Conclusão: não existe melhor, existe apropriado

Voltando à planilha de 2018. O erro não foi comparar features. Foi comparar filosofias como se fossem features.

**Kong** não é "gateway com plugins". É filosofia "controle total".
**Apigee** não é "gateway com portal". É filosofia "API como produto".
**AWS** não é "gateway serverless". É filosofia "AWS ecosystem".
**Azure** não é "gateway .NET". É filosofia "Microsoft stack".

Escolher errado é como usar um martelo para parafusos. Funciona, mas dói todo dia.

### Checklist de decisão

Antes de escolher, responda:

1. **Quem somos?** Startup, enterprise, tech company?
2. **O que precisamos?** Gateway básico ou plataforma API?
3. **Onde estamos?** AWS, Azure, multi-cloud, on-prem?
4. **Que skills temos?** DevOps, .NET, Kubernetes?
5. **Qual orçamento?** $100/mês ou $10k/mês?

A resposta não está na documentação. Está no seu contexto.

E contexto, bem entendido, é o único critério que importa.

---

## Exercício final

```yaml
# Sua situação atual:
empresa: "Fintech B2B"
stack: "Java/Spring, AWS, Kubernetes"
necessidade: "Gateway para APIs internas + partner APIs"
equipe: "5 devs, 2 DevOps"
orçamento: "$2k/mês"

# Pergunte: qual filosofia se alinha?
# 
# Não: "qual tem mais features?"
# Mas: "qual entende nosso contexto?"
#
# Talvez: Kong (K8s + controle) + AWS para serverless parts
# Talvez: AWS puro (simplicidade)
# 
# A resposta não está na tabela.
# Está no alinhamento entre filosofia do produto
# e filosofia da sua empresa.
#
# E filosofia não se mede em RPS ou dólares.
# Se sente no dia-a-dia.
```

**Última lição:** O melhor gateway não é o mais poderoso. É o que desaparece.

Quando você para de pensar no gateway e pensa apenas nas suas APIs, fez a escolha certa.

Quando o gateway vira obstáculo, fez a errada.

E essa diferença — entre ferramenta que ajuda e ferramenta que atrapalha — vale mais que qualquer feature list.

Escolha com sabedoria. Ou, como diria um colega: "Escolha o que dói menos às 3AM quando o pager toca."

Porque no final, é isso que importa: não quantas requests por segundo, mas quantas noites de sono.