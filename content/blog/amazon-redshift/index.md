---
title: "Do Disco ao Redshift: Como o Armazenamento Colunar Acelera Analytics"
date: "2026-03-01"
description: "Do row-store ao Redshift: armazenamento físico, MPP, DISTKEY, SORTKEY e uma arquitetura híbrida para latência de API em milissegundos."
featuredImage: redshift-architecture.svg
featured: false
---

**Vagner Clementino | Staff Engineer | Backend & Data**

Imagine que você tem 10 milhões de registros de vendas e precisa calcular a média de comissão por categoria. Em um banco tradicional como Postgres, isso pode levar segundos preciosos. Mas e se eu te contar que existe uma forma **física** de armazenar os dados no disco que torna essa query 20x mais rápida?

Vamos mergulhar no que acontece **de verdade** quando seus dados tocam o HD/SSD, entender por que bancos colunares como Redshift dominam analytics e resolver um problema real de recomendação de comissão para afiliados.

## Como os Dados Vivem no Disco: Row vs Columnar

Quando você armazena uma linha completa em um banco row-oriented (Postgres, MySQL), ela ocupa um bloco contínuo no disco:

```text
Bloco 64KB:
[ID=1, Nome=João, Email=joao@empresa.com, Saldo=100.50, Data=2026-01-01]
[ID=2, Nome=Maria, Email=maria@empresa.com, Saldo=250.75, Data=2026-01-02]
[...continua até encher o bloco]
```

Agora imagine que você quer calcular `AVG(saldo) WHERE cidade = 'São Paulo'`. O banco precisa ler esse bloco inteiro de 64KB, examinar cada linha para verificar a cidade, extrair o saldo e só então calcular a média. O resultado? Você gastou I/O precioso lendo nomes, emails e datas que nunca usaria.

Bancos colunares como Redshift invertem essa lógica completamente. Os dados são armazenados **por coluna**, não por linha:

```text
Bloco 1 (ID):     [1, 2, 3, 4, 5, 6...]
Bloco 2 (Cidade): ['SP', 'RJ', 'SP', 'MG', 'SP'...]
Bloco 3 (Saldo):  [100.50, 250.75, 75.30, 120.00...]
```

Para a mesma query de média de saldo em São Paulo, o Redshift lê apenas dois blocos: o da cidade (para filtrar) e o do saldo (para calcular). Em uma tabela com 100 colunas, você reduz o I/O de 100% para apenas 5%. É matemática pura.

## A Arquitetura do Redshift: Leader + MPP em Ação

O Redshift não é apenas “Postgres colunar”. Ele é um data warehouse **massivamente paralelo** (MPP), com dois tipos de nós trabalhando em harmonia.

O **Leader Node** recebe sua query SQL, gera um plano de execução distribuída e coordena os nós de computação. Cada **Compute Node** tem dezenas de CPUs e divide os dados em **slices** que processam em paralelo. Uma query que levaria 2 minutos em um único nó pode cair para 8 segundos com 16 nós.

## Distribution Key: O Segredo dos Joins Rápidos

Aqui entra o conceito mais poderoso do Redshift: a **Distribution Key** (`DISTKEY`). Sem ela, quando você faz um `JOIN` entre duas tabelas grandes, o Redshift precisa redistribuir dados entre os nós, o que pode tornar a query 10x mais lenta.

```sql
-- ❌ JOIN explode em redistribuição
CREATE TABLE vendas DISTKEY(random_column);

-- ✅ Mesmo customer_id fica no mesmo nó
CREATE TABLE vendas DISTKEY(customer_id);
```

Quando você usa `DISTKEY(customer_id)` em ambas as tabelas, todas as linhas com o mesmo `customer_id` ficam no mesmo nó físico. O `JOIN` acontece localmente, sem mover dados pela rede.

## Sort Key + Zone Maps: Pulando Blocos Inteiros

O **Sort Key** organiza os dados fisicamente no disco e cria **Zone Maps** (metadados de min/max por bloco). Imagine uma tabela ordenada por data:

```text
SORTKEY(sale_date, customer_id)

Bloco 1: 2026-01-01T00:00 [cust123, cust124, cust125...]
Bloco 2: 2026-01-01T12:00 [cust126, cust127...]
Bloco 3: 2026-01-02T00:00 [cust128...]
```

O Zone Map de cada bloco guarda: “Bloco 1 vai de 2026-01-01T00:00 até 2026-01-01T12:00”. Uma query com `WHERE sale_date >= '2026-01-02'` simplesmente pula os blocos 1 e 2 inteiros, lendo apenas a partir do bloco 3.

## O Problema Real: Sugestão de Comissão para Afiliados

Agora vamos para um caso concreto. Você tem uma plataforma de afiliados que precisa sugerir automaticamente a comissão ideal para novos produtos. A API recebe:

```json
POST /api/commission/suggest
{
  "category_id": 1,
  "niche_id": 10,
  "price": 135.00
}
```

E precisa responder em menos de 50ms com algo como `{ "suggested_pct": 10.5 }`.

Seus dados brutos têm 15 milhões de vendas históricas:

```text
product_id | category_id | niche_id | sale_price | commission_paid
1          | 1           | 10       | 120.00     | 12.60
2          | 1           | 10       | 155.00     | 18.60
...
```

Uma query ingênua seria:

```sql
SELECT AVG(commission_paid / sale_price * 100)
FROM vendas
WHERE category_id = 1
  AND niche_id = 10
  AND sale_price BETWEEN 100 AND 150;
```

Em Postgres row-store tradicional, isso leva **2,8 segundos**. Inaceitável para uma API.

## A Solução Elegante: Analytics Colunar + Serving Layer

A mágica acontece quando combinamos o poder analítico do Redshift com uma serving layer otimizada.

### 1. ETL diário no Redshift (PySpark, 18s para 15M linhas)

```sql
CREATE TABLE commission_lookup AS
SELECT
  category_id,
  niche_id,
  FLOOR(sale_price / 50) * 50 AS bucket_min,
  FLOOR(sale_price / 50) * 50 + 49.99 AS bucket_max,
  AVG(commission_paid / sale_price * 100) AS suggested_pct,
  COUNT(*) AS support_count
FROM fact_sales
GROUP BY 1, 2, 3, 4;
```

Isso gera apenas **2.500 linhas** (50 faixas de preço × 50 combinações categoria/nicho).

### 2. Postgres Serving Layer (lookup em 8ms)

```sql
CREATE TABLE commission_suggestion (
  category_id BIGINT,
  niche_id BIGINT,
  bucket_min DECIMAL(10,2),
  bucket_max DECIMAL(10,2),
  suggested_pct DECIMAL(5,2),
  support_count BIGINT
);

CREATE INDEX idx_commission_suggestion_lookup
  ON commission_suggestion (category_id, niche_id, bucket_min);
```

A query da API vira um lookup indexado:

```sql
SELECT suggested_pct
FROM commission_suggestion
WHERE category_id = 1
  AND niche_id = 10
  AND 135 BETWEEN bucket_min AND bucket_max
ORDER BY support_count DESC
LIMIT 1;
```

## Performance: Os Números Falam

| Abordagem | Tempo ETL | Latência API |
|-----------|-----------|--------------|
| Apenas Postgres | - | 2,8s |
| Redshift direto | 18s | 240ms |
| **Redshift + Serving** | **18s** | **8ms** |

## A Arquitetura de Produção que Funciona

```text
App Postgres (transacional)
       ↓ PySpark ETL (diário)
Redshift (analytics pesado)
       ↓
Serving Postgres (lookup 8ms)
       ↓
Spring Boot API (REST 10ms p99)
```

## As Regras que Salvam Sua Vida

Depois de quebrar a cabeça em produção, aqui estão as regras que eu sempre sigo:

1. **DISTKEY sempre na coluna de JOIN** com alta cardinalidade.
2. **SORTKEY com o filtro mais comum primeiro** (geralmente data).
3. **DISTSTYLE ALL para dimensões pequenas** (&lt;2GB).
4. **VACUUM após COPY massivo** e **ANALYZE semanal**.
5. **Serving layer para toda API** com latência crítica.

## Conclusão: Ferramenta Certa no Lugar Certo

Redshift não veio para substituir Postgres. Veio para **complementar**. Use row-store para transações e serving layer, columnar para analytics pesado. O ETL é a ponte que junta os dois mundos.

Para casos abaixo de 10GB, Postgres ainda segura. Acima disso, o híbrido colunar + serving layer é imbatível.

**Quer ver funcionando?** O código completo com Docker Compose, PySpark e Spring Boot 3.5 está no [GitHub](https://github.com/vagnerclementino/redshift-commission). Clone, rode `make up` e sinta a diferença na pele.

**Vagner Clementino**  
*Staff Engineer | notes.clementin.me | Março 2026*

---

**E você, já sentiu na pele a dor do I/O em analytics? Row-store ainda segura seu caso ou está na hora de colunar? Conta aqui nos comentários! 👇**

## Fontes e Referências de Estudo

### Fundamentos: Columnar vs Row-Oriented

- [AWS Docs — Columnar storage, disk, and memory management](https://docs.aws.amazon.com/redshift/latest/dg/c_columnar_storage_disk_mem_mgmnt.html)
- [TigerData — Columnar Databases vs Row-Oriented Databases](https://www.tigerdata.com/learn/columnar-databases-vs-row-oriented-databases-which-to-choose)
- [YouTube — Redshift Columnar Storage Vs Row Oriented Storage](https://www.youtube.com/watch?v=re2sDtlNAPk)

### Arquitetura e Design

- [Bix-Tech — Amazon Redshift Done Right](https://bix-tech.com/amazon-redshift-done-right-a-practical-blueprint-for-designing-a-scalable-high-performance-data-warehouse/)
- [AWS Big Data Blog — Architecture patterns to optimize Amazon Redshift performance at scale](https://aws.amazon.com/blogs/big-data/architecture-patterns-to-optimize-amazon-redshift-performance-at-scale/)
- [AWS Docs — Best practices](https://docs.aws.amazon.com/redshift/latest/dg/best-practices.html)
- [YouTube — AWS re:Invent 2024 (Redshift)](https://www.youtube.com/watch?v=NUEwUe5nE18)

### Distribution Key (Partition Key) e Table Design

- [OneUptime — Optimize Redshift Distribution and Sort Keys](https://oneuptime.com/blog/post/2026-02-12-optimize-redshift-distribution-and-sort-keys/view)
- [Hevo — Choosing the Right Redshift Distribution Keys](https://hevodata.com/blog/redshift-distribution-keys/)
- [Stack Overflow — Best sort key and partition key for self-join in Redshift](https://stackoverflow.com/questions/51776002/what-is-the-best-sort-key-and-partition-key-for-a-self-join-on-id-and-date-in-redshift)
- [ExperienceStack — Redshift Table Design Best Practices](https://experiencestack.co/redshift-table-design-best-practices-3b7cb0cfccd6)

### Sort Key, Zone Maps e Query Tuning

- [Plain English — Partitioning in AWS Redshift: a guide to boosting performance](https://aws.plainenglish.io/partitioning-in-aws-redshift-a-guide-to-boosting-performance-9689b1c9686f)
- [AWS Docs — Optimizing query performance](https://docs.aws.amazon.com/redshift/latest/dg/c_optimizing-query-performance.html)
- [AWS Docs — Designing queries best practices](https://docs.aws.amazon.com/redshift/latest/dg/c_designing-queries-best-practices.html)
- [e6data — How to optimize AWS Redshift queries](https://www.e6data.com/query-and-cost-optimization-hub/how-to-optimize-aws-redshift-queries)

### Operação, Manutenção e Otimização Contínua

- [Flexera — Optimizing Redshift Performance](https://www.flexera.com/blog/finops/optimizing-redshift-performance/)
- [Integrate.io — 15 Performance Tuning Techniques for Amazon Redshift](https://www.integrate.io/blog/15-performance-tuning-techniques-for-amazon-redshift/)
- [ProsperOps — Redshift Optimization Techniques](https://www.prosperops.com/blog/redshift-optimization/)

### Documentação oficial base (consulta rápida)

- [AWS Redshift Overview](https://docs.aws.amazon.com/redshift/latest/dg/c_redshift-overview.html)
- [AWS Docs — Best practices for designing tables](https://docs.aws.amazon.com/redshift/latest/dg/c_best-practices-best-dist-key.html)
- [AWS Docs — Sorting data (Sort Keys e Zone Maps)](https://docs.aws.amazon.com/redshift/latest/dg/t_Sorting_data.html)
