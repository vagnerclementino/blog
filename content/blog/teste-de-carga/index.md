---
title: "Teste de Carga: quando performance deixa de ser feature e vira survival"
date: "2026-02-23"
description: "Uma análise de testes de carga além dos números — a filosofia por trás de sistemas que não quebram sob pressão"
featuredImage: feature.png
---

## Introdução: o dia em que Black Friday virou Blackout Friday

2019. E-commerce brasileiro. Black Friday. 00:01.

O site recebeu 10x o tráfego normal. E caiu. Não gradualmente — catastropicamente. 100% de erro rate por 15 minutos.

Quando recuperamos, perdemos R$ 2 milhões em 15 minutos. E a confiança dos clientes para sempre.

O problema não foi falta de teste de carga. Fizemos testes. O problema foi **testar errado**.

Este artigo não é sobre ferramentas de load testing. É sobre a **mentalidade** por trás de testes que realmente previnem desastres. Porque testar carga não é sobre números. É sobre sobrevivência.

---

## Os três mitos do teste de carga

### Mito 1: "Testamos com 10x o tráfego normal"
```bash
# ❌ Teste ingênuo
usuários normais: 1000
teste: 10000 usuários

# Problema: tráfego real não é uniforme
# Black Friday: picos de 100x em segundos
```

### Mito 2: "Nosso p95 latency é 200ms"
```bash
# ❌ Métrica enganosa
p95: 200ms  # "Apenas" 5% acima
p99: 2000ms # 1% dos usuários espera 2 segundos
p99.9: timeout # 0.1% falha completamente
```

### Mito 3: "A aplicação aguenta, é o banco que não"
```bash
# ❌ Culpar componentes externos
App: 1000 RPS ✅
DB: 100 queries/sec ❌

# Realidade: Sistema = app + dependencies
# Se DB não aguenta, sistema não aguenta
```

A verdade: teste de carga mal feito é pior que nenhum teste. Dá falsa confiança.

---

## A pirâmide do teste de performance

### 1. Unit performance tests (base)
```javascript
// Teste unitário de algoritmo
test('sort performance', () => {
  const data = generateLargeDataset();
  const start = performance.now();
  sortAlgorithm(data);
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(100); // 100ms max
});
```

**Foco:** Algoritmos, data structures, hot paths.

### 2. Integration performance tests
```javascript
// Teste de integração
test('API endpoint performance', async () => {
  const requests = Array(100).fill().map(() => 
    fetch('/api/products')
  );
  
  const start = Date.now();
  await Promise.all(requests);
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(1000); // 1 segundo para 100 reqs
});
```

**Foco:** Endpoints, database queries, external calls.

### 3. Load tests (o que chamamos de "teste de carga")
```bash
# 1000 usuários simultâneos por 10 minutos
k6 run --vus 1000 --duration 10m script.js
```

**Foco:** Sistema sob carga sustentada.

### 4. Stress tests
```bash
# Aumenta carga até quebrar
k6 run --vus 100 --duration 1m \
       --vus 500 --duration 1m \
       --vus 1000 --duration 1m \
       --vus 5000 --duration 1m  # Até falhar
```

**Foco:** Limites do sistema, breaking point.

### 5. Soak tests (endurance)
```bash
# Carga moderada por horas/dias
k6 run --vus 100 --duration 24h script.js
```

**Foco:** Memory leaks, resource exhaustion.

### 6. Spike tests
```bash
# Pico súbito de tráfego
k6 run --vus 10 --duration 1m \
       --vus 1000 --duration 30s \  # SPIKE
       --vus 10 --duration 1m
```

**Foco:** Elasticity, auto-scaling.

---

## Ferramentas: o ecossistema 2026

### k6 (Grafana Labs)
```javascript
// script.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stable
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p95<500', 'p99<1000'],
    http_req_failed: ['rate<0.01'], // 1% error rate max
  },
};

export default function() {
  const res = http.get('https://api.example.com/products');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

**Vantagens:** JavaScript, thresholds, integração com Grafana.

### Locust (Python)
```python
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def view_products(self):
        self.client.get("/products")
    
    @task(3)  # 3x mais frequente
    def view_product_detail(self):
        self.client.get("/products/1")
```

**Vantagens:** Python, código como configuração, distributed.

### Apache JMeter (Java)
```xml
<!-- JMeter .jmx -->
<ThreadGroup>
  <num_threads>100</num_threads>
  <ramp_time>60</ramp_time>
  <duration>300</duration>
</ThreadGroup>
<HTTPSampler>
  <domain>api.example.com</domain>
  <path>/products</path>
</HTTPSampler>
```

**Vantagens:** Mature, GUI, muitos plugins.

### Artillery
```yaml
# artillery.yml
config:
  target: "https://api.example.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 300
      arrivalRate: 100
      name: Load test
  payload:
    path: "users.csv"
    fields:
      - "userId"
      - "email"

scenarios:
  - flow:
      - post:
          url: "/login"
          json:
            email: "{{ email }}"
          capture:
            json: "$.token"
            as: "authToken"
      - get:
          url: "/profile"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

**Vantagens:** YAML, fácil de ler, poderoso.

### Gatling (Scala)
```scala
class BasicSimulation extends Simulation {
  val httpProtocol = http.baseUrl("https://api.example.com")
  
  val scn = scenario("Basic Simulation")
    .exec(http("request_1").get("/"))
    .pause(5)
    .exec(http("request_2").get("/products"))
  
  setUp(
    scn.inject(
      rampUsersPerSec(1).to(100).during(60),
      constantUsersPerSec(100).during(300)
    ).protocols(httpProtocol)
  )
}
```

**Vantagens:** Performance, reports bonitos, Scala DSL.

---

## Métricas que importam (e as que enganam)

### Core metrics (não negocie)

**1. Error rate**
```bash
# Aceitável: < 1%
# Alerta: 1-5%
# Crítico: > 5%
http_req_failed < 0.01
```

**2. Response time percentiles**
```bash
# Não olhe apenas média!
p50: 100ms    # Metade das requests
p95: 500ms    # 95% abaixo disso  
p99: 1000ms   # 1% mais lento
p99.9: 2000ms # 0.1% muito lento
```

**3. Throughput**
```bash
# Requests por segundo que sistema aguenta
# Antes de degradar
max_throughput = 1000 RPS  # Limite conhecido
```

**4. Concurrent users**
```bash
# Usuários simultâneos ativos
# Diferente de requests/sec
1000 users * 1 req/10s = 100 RPS
100 users * 10 req/s = 1000 RPS
```

### Resource metrics (dependem do sistema)

**CPU:** > 80% sustained = bottleneck
**Memory:** Leaks em soak tests
**Network:** Bandwidth, connections
**Disk I/O:** Read/write latency

### Business metrics (as mais importantes)

**1. Conversion rate sob carga**
```bash
# Usuários conseguem completar compra?
# Se latency aumenta 1s, sales caem 7%
```

**2. Revenue impact**
```bash
# Custo do downtime
downtime_cost = (revenue_per_minute * minutes_down)
```

**3. User satisfaction**
```bash
# Google: > 3s load time = 32% bounce rate
# Amazon: 100ms delay = 1% sales drop
```

---

## Cenários realistas (não apenas "1000 users")

### Cenário 1: E-commerce (Black Friday)
```javascript
// Padrão de tráfego real
const scenarios = {
  midnightSpike: { // 00:00-00:15
    users: 10000,
    duration: '15m',
    actions: ['viewDeals', 'addToCart', 'checkout']
  },
  morningBrowse: { // 08:00-12:00  
    users: 2000,
    duration: '4h',
    actions: ['viewProducts', 'search', 'readReviews']
  },
  eveningCheckout: { // 18:00-22:00
    users: 5000,
    duration: '4h',
    actions: ['viewCart', 'applyCoupon', 'checkout']
  }
};
```

### Cenário 2: API SaaS (business hours)
```javascript
// Padrão B2B
const scenarios = {
  workday: {
    '09:00': { users: 100 },   // Começo do dia
    '11:00': { users: 500 },   // Pico manhã
    '14:00': { users: 300 },   // Após almoço
    '16:00': { users: 800 },   // Pico tarde
    '18:00': { users: 50 }     // Fim do dia
  },
  monthEnd: { // Final de mês (relatórios)
    users: 1500,
    actions: ['generateReport', 'exportData']
  }
};
```

### Cenário 3: Social media (event-driven)
```javascript
// Picos por eventos
const scenarios = {
  breakingNews: {
    users: 50000,
    rampUp: '30s',    // Muito rápido
    duration: '10m',
    actions: ['refreshFeed', 'postComment', 'share']
  },
  liveStream: {
    users: 100000,
    duration: '2h',
    actions: ['watchStream', 'sendChatMessage', 'like']
  }
};
```

---

## O teste que salvou nossa Black Friday (2024)

### Problema identificado (2023)
```bash
# Teste antigo: 5000 users constantes
# Resultado: p95 800ms ✅
# Realidade: caiu no pico
```

### Nova abordagem (2024)
```javascript
// 1. Spike test
export const options = {
  stages: [
    { duration: '10s', target: 100 },   // Normal
    { duration: '5s', target: 10000 },  // SPIKE (100x)
    { duration: '30s', target: 10000 }, // Sustentado
    { duration: '10s', target: 100 },   // Volta ao normal
  ]
};

// 2. Testar fluxo completo
const flow = [
  'homepage',
  'search',
  'productPage',
  'addToCart',
  'checkout',
  'payment'  // Mais crítico!
];

// 3. Dados realistas
const products = loadCSV('black_friday_products.csv');
const users = loadCSV('real_users.csv');
```

### Descobertas

**1. Payment service bottleneck**
```bash
# Limite: 500 payments/minuto
# Necessário: 5000 payments/minuto no pico
# Solução: Queue + async processing
```

**2. Cart service stateful**
```bash
# Session stickiness quebrou load balancing
# Solução: Redis para cart state
```

**3. Search service cache miss storm**
```bash
# 1000 users procurando mesmo produto novo
# DB sobrecarregado
# Solução: Cache warming antes do evento
```

### Resultado 2024
```bash
Black Friday 2024:
- Pico: 15000 users simultâneos
- Error rate: 0.2% (vs 100% em 2019)
- Revenue: R$ 50M (record)
- Uptime: 99.99%
```

---

## Armadilhas comuns (e como evitar)

### 1. Teste em ambiente não-representativo
```bash
# ❌ Teste em dev com 2 CPUs, prod tem 16
# ✅ Ambiente staging = prod (mesmo hardware/configuration)
```

### 2. Ignorar cold starts
```bash
# ❌ Teste após warmup
# ✅ Incluir cold start no teste
# Serverless: função dormindo → acordando
```

### 3. Testar apenas happy path
```bash
# ❌ Apenas requests que dão certo
# ✅ Incluir:
#   - Invalid inputs
#   - Concurrent updates
#   - Network failures
```

### 4. Esquecer de dependencies
```bash
# ❌ Testar app isolada
# ✅ Testar com:
#   - DB under load
#   - Cache
#   - External APIs (com rate limits)
```

### 5. Não testar recovery
```bash
# ❌ Parar teste quando falha
# ✅ Continuar após falha:
#   - Como sistema se recupera?
#   - Auto-scaling funciona?
#   - Circuit breakers abrem/fecham?
```

---

## Teste de carga contínuo (Shift-left performance)

### No CI/CD pipeline
```yaml
# .github/workflows/load-test.yml
name: Load Test
on: [push]

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: grafana/k6-action@v0.3.0
        with:
          filename: test/load.js
          flags: --out json=results.json
      
      - name: Analyze results
        run: |
          if grep -q '"failed":' results.json; then
            echo "Load test failed!"
            exit 1
          fi
```

### Em produção (canary testing)
```javascript
// 1% do tráfego real para nova versão
// Monitorar metrics vs baseline
const canaryMetrics = {
  latency: 'p95 < 150% of baseline',
  errorRate: '< 2x baseline',
  throughput: '> 80% of baseline'
};
```

### Performance budgets
```json
{
  "budgets": {
    "homepage": {
      "loadTime": "2s",
      "tti": "3.5s",
      "size": "500KB"
    },
    "api": {
      "p95": "200ms",
      "p99": "500ms",
      "errorRate": "0.5%"
    }
  }
}
```

---

## Quando o teste falha: debugging em produção

### 1. Immediate actions
```bash
# Triagem rápida
1. Scale up (auto-scaling ou manual)
2. Degrade features (desligar recomendações)
3. Enable circuit breakers
4. Static fallback (maintenance page)
```

### 2. Diagnostics
```bash
# Ferramentas
- Metrics: Prometheus, Datadog
- Tracing: Jaeger, Zipkin
- Logs: ELK, Loki
- Profiling: pyroscope, perf
```

### 3. Common culprits
```bash
# Checklist
☐ Database connection pool exhausted
☐ Cache stampede
☐ External API rate limit
☐ Memory leak
☐ Thread pool exhaustion
☐ Disk I/O saturation
☐ Network bandwidth
```

---

## O futuro: AI, chaos engineering, e além

### AI-powered load testing
```javascript
// Futuro: IA gera cenários realistas
const aiScenarios = generateScenarios({
  basedOn: 'productionTraffic',
  simulate: 'unexpectedEvents',
  optimizeFor: 'worstCase'
});
```

### Chaos engineering integrado
```bash
# Testar resiliência
1. Inject latency (50-1000ms)
2. Kill instances randomly
3. Throttle network
4. Corrupt responses
```

### Performance as code
```yaml
# Declarative performance
apiVersion: performance.v1
kind: LoadTest
spec:
  scenarios:
    - name: black-friday
      users: 10000
      duration: 1h
      thresholds:
        errorRate: < 1%
        p95: < 500ms
  runSchedule:
    - cron: "0 2 * * *"  # Diariamente 2AM
    - onDeploy: true
```

### Real-user monitoring (RUM) driving tests
```javascript
// Testes baseados em usuários reais
const realUserPatterns = analyzeRUMData({
  userJourneys: 'checkoutFlow',
  slowestPaths: 'paymentProcessing',
  errorClusters: 'cartUpdates'
});
```

---

## Conclusão: performance como cultura, não como teste

Voltando ao Blackout Friday de 2019. O problema não foi técnico. Foi **cultural**.

Tínhamos:
- Testes de carga? ✅
- Monitoring? ✅  
- Auto-scaling? ✅

Mas faltava:
- **Mentalidade de sobrevivência:** "Isto pode quebrar a qualquer momento"
- **Testes realistas:** Não apenas números, mas padrões reais
- **Preparação para falha:** Não apenas para sucesso

### A mudança necessária

**De:** "Fazemos teste de carga antes do deploy"
**Para:** "Performance é propriedade de todo código, todo deploy, todo dia"

**De:** "O time de performance testa"
**Para:** "Todo desenvolvedor é responsável por performance"

**De:** "Passou no teste = pronto para produção"
**Para:** "O teste é baseline, produção é a prova real"

### Checklist cultural

Antes de dizer "nosso sistema é performático", verifique:

- [ ] **Todo PR** tem performance impact considerado?
- [ ] **Todo deploy** tem canary testing com metrics?
- [ ] **Todo evento** (Black Friday, lançamento) tem teste específico?
- [ ] **Todo time** entende SLAs e SLOs?
- [ ] **Todo incidente** gera aprendizado de performance?

### Última lição

Teste de carga não é sobre números em relatórios. É sobre **confiança**.

Confiança de que:
- Quando 10000 usuários chegarem ao mesmo tempo, o sistema aguenta
- Quando um serviço externo falhar, o sistema degrada graciosamente
- Quando algo quebrar, você sabe exatamente o quê e por quê

E confiança, em sistemas distribuídos, é o recurso mais escasso e mais valioso.

---

```javascript
// Seu sistema hoje
// Quantos usuários simultâneos aguenta?
// Em quanto tempo escala 10x?
// Como se comporta quando dependencies falham?

// Se não sabe, está voando cego.
// 
// Teste de carga não é luxo.
// É mapa de navegação.
// 
// E sem mapa, é questão de tempo
// até bater em um iceberg.
// 
// Black Friday, lançamento viral,
// ataque DDoS, bug que causa loop...
// 
// O iceberg vem.
// A questão é: você tem mapa?
```

Performance não é feature. É survival. E em um mundo digital, survival não é opcional.

Comece hoje. Não com ferramentas complexas. Com uma pergunta simples: "O que acontece se 10x mais usuários chegarem agora?"

A resposta pode salvar seu negócio. Como salvou o nosso.

E no final, é isso que importa: não quantos requests por segundo, mas quantos negócios por segundo continuam funcionando quando tudo dá errado.