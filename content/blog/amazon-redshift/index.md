---
title: "Amazon Redshift: Data Warehouse em Escala"
date: "2025-03-02"
description: "Um mergulho técnico na arquitetura, conceitos e casos de uso do Amazon Redshift, o data warehouse da AWS"
featuredImage: redshift-architecture.svg
featured: false
---

## Introdução

O **Amazon Redshift** é um serviço de data warehouse fully-managed da AWS, projetado para processamento analítico em larga escala. Diferente de bancos de dados transacionais tradicionais, o Redshift é otimizado para consultas complexas sobre grandes volumes de dados, oferecendo performance superior a fração do custo de soluções enterprise tradicionais.

Neste artigo, exploraremos os conceitos fundamentais da arquitetura do Redshift, seus casos de uso principais e as decisões de design que o tornam uma escolha poderosa para analytics moderno.

## Arquitetura Columnar e MPP

### Armazenamento Columnar

O Redshift armazena dados por coluna em vez de por linha. Isso traz vantagens significativas:

- **Compressão superior**: Dados do mesmo tipo são armazenados juntos, permitindo algoritmos de compressão mais eficientes (geralmente 2-10x)
- **I/O reduzido**: Consultas que acessam apenas algumas colunas lêem apenas os dados necessários
- **Cache eficiente**: O processador pode manter colunas frequentes em cache L3

### Arquitetura MPP (Massively Parallel Processing)

Cada cluster Redshift é composto por um **nó líder** e múltiplos **nós de computação**:

```
Nó Líder
├─ Recebe e planeja consultas
├─ Coordena execução paralela
└─ Armazena metadados

Nós de Computação (1-N)
├─ Cada nó possui 1+ slices (CPU + memória)
├─ Dividem dados em blocos de 1MB (distribution keys)
└─ Executam operações em paralelo
```

**Key Insight**: A performance escala linearmente com o número de nós (até certo ponto). Consultas são automaticamente paralelizadas pelo nó líder e executadas em todos os nós simultaneamente.

### Distribution Styles

A escolha do `DISTSTYLE` é crítica para performance:

| Style | Caso de Uso | Prós | Contras |
|-------|-------------|------|---------|
| **EVEN** | Sem chave clara | Balanceamento automático | Data skew em joins |
| **KEY** | Tabelas com joins frequentes | Co-locação de dados relacionados | Overhead em scans |
| **ALL** | Tabelas dimensão pequenas (<2GB) | Broadcast para todos os nós | Consumo de disco multiplicado |
| **AUTO** | Padrão (AWS decide) | Simplicidade | Pouco controle |

**Best Practice**: Use `KEY` para tabelas fato com joins em chaves de distribuição comuns. Evite data skew (desbalanceamento) que causa "slow nodes".

## Camadas de Armazenamento e Processamento

### 1. Storage Layer (Local Disks)

Cada nó possui múltiplos discos SSD locais. Dados são armazenados em blocos de 1MB com checksums para integridade. O Redshift ger automaticamente:

- **Column encoding**: Usa LZO, ZSTD, BYTEDICT, DELTA, etc.
- **Sort keys**: Ordenação física para zone maps (min/max por bloco)
- **Vacuum**: Reorganização para remover linhas deletadas e reordenar

### 2. Query Processing Pipeline

```
Parse → Rewrite → Optimize → Execute
```

**Optimizer**:
- Usa estatísticas coletadas via `ANALYZE`
- Considera distribution styles e sort keys
- Gera planos de execução paralelos

**Execution Engine**:
- Pipeline de operadores (Scan, Join, Aggregate, etc.)
- Processamento vetorizado ( batches de 100-1000 rows)
- Operações in-memory quando possível

## Casos de Uso Principais

### 1. Business Intelligence e Dashboards

**Cenário**: Relatórios executivos, KPIs, métricas de negócio

**Por que Redshift**:
- Consultas complexas com múltiplos joins e agregações
- Performance consistente mesmo com múltiplos usuários simultâneos
- Integração nativa com ferramentas BI (Tableau, Power BI, Looker)

**Exemplo de carga**:
```sql
-- Dashboard de vendas diário
SELECT 
  date_trunc('day', order_date) as dia,
  product_category,
  SUM(revenue) as total_revenue,
  COUNT(DISTINCT customer_id) as compradores_unicos
FROM fact_orders
WHERE order_date >= '2025-01-01'
GROUP BY 1, 2
ORDER BY 1 DESC;
```

### 2. Data Lake Analytics

**Cenário**: Consultas ad-hoc sobre dados brutos em S3 (data lake)

**Recursos**:
- **Redshift Spectrum**: Consulta dados externos no S3 sem carregar
- **Redshift Serverless**: Elasticidade para cargas variáveis
- **Materialized Views**: Pré-computa resultados frequentes

**Exemplo com Spectrum**:
```sql
-- Unir dados no Redshift com logs no S3
SELECT 
  s.user_id,
  s.session_duration,
  o.order_value
FROM spectrum.user_sessions s
JOIN orders o ON s.user_id = o.user_id
WHERE s.date = '2025-03-01';
```

### 3. ETL e Data Pipelines

**Cenário**: Transformação de dados antes de carregar em data marts

**Por que Redshift**:
- SQL nativo para transformações (sem ferramentas externas)
- `COPY` command para ingestão bulk de S3/ DynamoDB
- `UNLOAD` para exportar resultados

**Pipeline típico**:
```
S3 (raw) → COPY → Redshift (staging) → SQL transforms → Data Marts
```

### 4. Machine Learning Features

**Cenário**: Feature engineering para modelos preditivos

- **Redshift ML**: Treina modelos diretamente em SQL (com Amazon SageMaker)
- **Materialized Views**: Serve features em tempo real para aplicações
- **Concurrency scaling**: Atende múltiplos data scientists simultaneamente

## Comparação com Alternativas

### Redshift vs. Snowflake

| Aspecto | Redshift | Snowflake |
|---------|----------|-----------|
| **Arquitetura** | MPP tradicional | Separated compute/storage |
| **Elasticidade** | Concurrency scaling (add-on) | Auto-scaling nativo |
| **Custo** | Pago por hora de cluster | Pago por crédito de compute |
| **Ecossistema** | AWS nativo | Multi-cloud |
| **Performance** | Predictable (nós fixos) | Variable (auto-scaling) |

**Quando escolher Redshift**: Workloads previsíveis, forte integração AWS, otimização de custo com instâncias reservadas.

### Redshift vs. BigQuery

| Aspecto | Redshift | BigQuery |
|---------|----------|----------|
| **Modelo** | Cluster gerenciado | Serverless |
| **Preço** | Por nó/hora + storage | Por consulta (TB processado) |
| **Latência** | Baixa (nós dedicados) | Variável (multi-tenant) |
| **Controle** | Máximo (parâmetros de cluster) | Mínimo (black-box) |

**Quando escolher Redshift**: Latência consistente crítica, workload batch pesado, necessidade de tuning fino.

### Redshift vs. PostgreSQL

| Aspecto | Redshift | PostgreSQL |
|---------|----------|------------|
| **Otimização** | Colunar, MPP | Row-based, single-node |
| **Scale** | PB (clusters grandes) | TB (com particionamento) |
| **Concurrency** | Alta (concurrency scaling) | Baixa-média |
| **SQL** | Subconjunto (algumas limitações) | Completo (com extensões) |

**Quando escolher Redshift**: Volume > 1TB, consultas analíticas complexas, múltiplos usuários simultâneos.

## Boas Práticas de Performance

### 1. Sort Keys

- **Compound**: Ordenação múltipla colunas (ideal para queries com filtros sequenciais)
- **Interleaved**: Peso igual por coluna (ideal para queries com filtros independentes)

```sql
-- Compound (padrão)
CREATE TABLE orders (
  order_date DATE,
  customer_id INT,
  amount DECIMAL(10,2)
) SORTKEY(order_date, customer_id);

-- Interleaved (para queries variadas)
CREATE TABLE events SORTKEY INTERLEAVED (user_id, event_type, timestamp);
```

### 2. Compression Encoding

Use `ENCODE` automático ou manual para colunas específicas:

```sql
-- Encoding manual para otimização
ALTER TABLE users 
  ALTER COLUMN email SET ENCODE LZO,
  ALTER COLUMN age SET ENCODE DELTA,
  ALTER COLUMN status SET ENCODE BYTEDICT;
```

### 3. Vacuum e Analyze

- `VACUUM`: Reorganiza dados após DELETE/UPDATE (executar após 20-30% das rows deletadas)
- `ANALYZE`: Atualiza estatísticas para optimizer (executar após cargas massivas)

```bash
# Schedule automático (recomendado)
VACUUM DELETE ONLY table_name;
ANALYZE table_name;
```

### 4. Workload Management (WLM)

Configure filas para isolar workloads:

```sql
-- Exemplo: 3 filas (ETL, BI, Ad-hoc)
CREATE WLM QUERY SLOT COUNT 3;
```

- Queue 1: ETL (memória alta, timeout alto)
- Queue 2: BI (memória média, timeout médio)
- Queue 3: Ad-hoc (memória baixa, timeout baixo)

### 5. Materialized Views

Pré-computa resultados de consultas frequentes:

```sql
CREATE MATERIALIZED VIEW mv_daily_sales
AS
SELECT 
  date_trunc('day', order_date) as day,
  SUM(amount) as total_sales
FROM orders
GROUP BY 1;

-- Refresh manual ou automático
REFRESH MATERIALIZED VIEW mv_daily_sales;
```

## Custo e Otimização

### Opções de Preço

1. **On-Demand**: Pago por hora (flexível, caro)
2. **Reserved Instances**: 1-3 anos (30-60% desconto)
3. **Serverless**: Pago por RPU (Redshift Processing Unit) usado

### Otimizações de Custo

- **Resize clusters** baseado em carga (cresce/diminuí)
- **Pause/resume** clusters não-utilizados (serverless ou RA3)
- **Archive old data** para S3 (Redshift Spectrum)
- **Use Concurrency Scaling** apenas quando necessário (custo extra)

## Monitoramento e Observabilidade

### Métricas Chave (CloudWatch)

- `CPUUtilization` (ideal 60-80%)
- `ReadIOPS`/`WriteIOPS` (limite de disco)
- `HealthStatus` (vermelho = problema)
- `QueryDuration` (p95, p99)
- `SpillToDisk` (indica memória insuficiente)

### Queries de Diagnóstico

```sql
-- Top 10 queries mais lentas (última semana)
SELECT query, substring(text, 1, 100) as sample,
       starttime, endtime, (endtime - starttime) as duration
FROM stl_query 
WHERE starttime > dateadd(day, -7, current_date)
ORDER BY duration DESC
LIMIT 10;

-- Tabelas com mais skew
SELECT "table", slice, rows
FROM stv_tbl_perm
WHERE "table" = 'orders'
ORDER BY rows DESC;

-- Espaço por tabela
SELECT "table", size, tbl_rows
FROM stv_tbl_perm
ORDER BY size DESC;
```

## Limitações e Gotchas

1. **Transações limitadas**: Não suporta UPDATE/DELETE pesados (use staging tables)
2. **Locking**: Bloqueios a nível de tabela (não row-level)
3. **Date types**: Sem TIMEZONE (use TIMESTAMP com fuso manual)
4. **Full outer joins**: Não suportado (use UNION)
5. **Recursão**: Sem CTE recursivo
6. **Indexes**: Apenas sort keys e dist keys (sem indexes B-tree tradicionais)

## Quando NÃO Usar Redshift

- **Workloads OLTP** (alta taxa de writes, queries simples)
- **Dados não-estruturados** (JSON/XML complexos) → considere MongoDB/Elasticsearch
- **Sub-1TB** → PostgreSQL pode ser suficiente
- **Latência < 100ms** → considere cache (Redis) ou OLAP em-memória

## Tendências e Futuro

- **Redshift Serverless**: Elasticidade automática (GA 2023)
- **RA3 nodes**: Storage separado (gerenciado) + compute local
- **AQUA**: Cache acelerado por hardware (até 10x performance)
- **Zero-ETL**: Integração com Aurora (replicação automática)

## Conclusão

O Amazon Redshift é uma solução madura e robusta para data warehousing em escala. Sua arquitetura MPP columnar oferece performance previsível para workloads analíticos complexos, enquanto o modelo gerenciado reduz overhead operacional.

O sucesso com Redshift depende de:
1. **Modelagem adequada** (distribution/sort keys corretos)
2. **Workload understanding** (WLM tuning)
3. **Monitoramento proativo** (métricas e queries de diagnóstico)
4. **Custo alinhado** (reserved instances, auto-suspend)

Para organizações com dados > 1TB e necessidade de analytics em tempo real, Redshift continua sendo uma das melhores opções no mercado, especialmente dentro do ecossistema AWS.

---

## Referências

1. [Amazon Redshift Database Developer Guide](https://docs.aws.amazon.com/redshift/latest/dg/)
2. [Redshift Architecture Whitepaper](https://aws.amazon.com/redshift/pricing/)
3. [Best Practices for Amazon Redshift](https://docs.aws.amazon.com/redshift/latest/dg/best-practices.html)
4. [Redshift Spectrum](https://docs.aws.amazon.com/redshift/latest/dg/c-using-spectrum.html)
5. [Workload Management (WLM)](https://docs.aws.amazon.com/redshift/latest/dg/wlm-intro.html)
6. [Materialized Views](https://docs.aws.amazon.com/redshift/latest/dg/materialized-view-intro.html)
7. [Redshift vs. Snowflake Comparison](https://aws.amazon.com/redshift/compare/)
8. [Concurrency Scaling](https://docs.aws.amazon.com/redshift/latest/dg/concurrency-scaling.html)