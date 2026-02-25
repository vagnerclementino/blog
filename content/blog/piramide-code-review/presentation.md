---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
style: |
  section {
    font-family: 'Inter', system-ui, sans-serif;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
  }
  strong {
    color: #dc2626;
  }
---

# Pirâmide de Code Review

## O que automatizar e o que manter humano

Como estruturar revisão de código com automação na base e julgamento técnico no topo

---

# Introdução

Code review fica lindo no slide.

**No mundo real, vira caos fácil.**

- Todo time diz que revisa código
- Poucos fazem com consistência, profundidade e velocidade

**Pergunta central:**

> O que dá para automatizar sem esvaziar o valor humano da revisão?

---

# A Resposta: Pirâmide de Code Review

**Base:** automatizável (regras objetivas)

**Topo:** humano (julgamento contextual)

![bg right:50% w:400](./code-review-pyramid.svg)

*Base visual: Gunnar Morling*

---

# Conexão com Ágil e 12-Factor

## Manifesto Ágil

- **Indivíduos e interações**: review é interação técnica, não gate de processo
- **Excelência técnica contínua**: revisar = manter sistema evolutivo

## 12-Factor App

- **Codebase**: versão compartilhada favorece revisão transparente
- **Build/Release/Run**: checks automáticos por camada
- **Dev/Prod parity**: menos desvio = checks mais confiáveis
- **Logs**: reviewers decidem melhor com sinais de impacto

---

# História do Code Review

## Origens

- **1976**: Michael Fagan (IBM) formaliza inspeções de software
- Décadas depois: processos mais leves (patches por e-mail, listas)
- **2008**: GitHub lança Pull Requests (23 de fevereiro)

## Nomes no ecossistema

- Pull Request (PR) — GitHub, Bitbucket
- Merge Request (MR) — GitLab
- Change / Patch Set — Gerrit
- Change List (CL) — fluxo interno
- Differential Revision — Phabricator

**Essência:** propor, revisar coletivamente, integrar

---

# Sequência Histórica e Prática

1. **Engenharia de Software** — processo, qualidade, manutenção
2. **Desenvolvimento Ágil** — feedback curto, entrega contínua
3. **Controle de versão** — colaboração segura
4. **Git** — modelo distribuído em larga escala
5. **GitHub** — fluxo social e assíncrono (PR)
6. **Pirâmide de Code Review** — organiza energia humana vs automação
7. **Ferramentas de automação** — reduzem ruído
8. **IA** — copiloto, não substituto

**Essa ordem importa.** Primeiro processo, depois automação e IA.

---

# A Pirâmide: 3 Perguntas

1. O que **deve** ser automatizado?
2. O que **pode** ser parcialmente automatizado?
3. O que **não deveria** ser automatizado?

---

# Nível 1 — Qualidade Mecânica

## Base automatizável

Regras sem subjetividade. Se é determinístico, não consome tempo humano.

**Exemplos:**

- Formatação (Prettier, Black, gofmt)
- Lint e convenções
- Checagem de imports, dead code
- Segredos em commit, vulnerabilidades

**Objetivo:** Remover ruído. Quem revisa não comenta espaço ou ponto e vírgula.

---

# Nível 2 — Segurança e Integridade

## Ainda muito automatizável

**Exemplos:**

- SAST e scanners de dependência
- Política de branch protection
- Validação de permissões e arquivos sensíveis
- Checks obrigatórios de CI

**Objetivo:** Barrar regressões graves antes de qualquer discussão subjetiva.

---

# Nível 3 — Comportamento e Contrato

## Testes e evidências

**Exemplos:**

- Testes unitários, integração e contrato
- Cobertura mínima por módulo crítico
- Verificação de compatibilidade de API
- Snapshots/approvals

**Objetivo:** Responder: *"essa mudança ainda faz o que deveria fazer?"*

---

# Nível 4 — Design e Arquitetura

## Zona cinza começa aqui

**Exemplos:**

- Impacto em acoplamento e limites arquiteturais
- Legibilidade, coesão, nomes e modelagem
- Trade-offs de performance e manutenção

**É possível automatizar parcialmente?**

Sim: métricas, detectores de complexidade, IA.

**Mas a decisão final ainda é humana.**

---

# Nível 5 — Produto, Risco e Estratégia

## Topo da pirâmide

Pergunta deixa de ser técnica e vira decisão de produto.

**Exemplos:**

- Isso resolve o problema certo?
- O risco operacional é aceitável?
- A mudança está alinhada à estratégia?
- O custo de manter compensa o ganho?

**Automação apoia contexto, mas não decide prioridade.**

---

# Code Agents e o Papel Humano

## Com IA, o volume de mudança aumentou

Você produz mais diff por hora. Às vezes, muito mais.

**Isso torna o humano MAIS importante, não menos.**

Code agent é ótimo para:

- Acelerar implementação e boilerplate
- Testes iniciais
- Refatorações repetitivas
- Documentação de apoio

**Mas não responde perguntas centrais de engenharia.**

---

# Perguntas que o Humano Responde

- Essa escolha faz sentido para o contexto do produto?
- Esse trade-off operacional é aceitável?
- A mudança é segura para quem já usa a API em produção?

> **Agente acelera execução; humano responde por direção, coerência e risco.**

---

# Ferramentas Recomendadas

## Junto com CI

| Categoria | Ferramentas |
|-----------|-------------|
| Linters/Formatters | ESLint, Prettier, Ruff, Black |
| SAST e Segurança | Semgrep, CodeQL, Snyk, Dependabot |
| Qualidade Estática | SonarQube, Code Climate |
| Assistentes de Revisão | GitHub Copilot, CodeRabbit, CodeWhisperer |

**Recomendação:** Use IA para reduzir trabalho mecânico, sem terceirizar a decisão técnica.

---

# Code Review ≠ Quality Assurance

## Muitas equipes misturam os termos

**Code Review:**

- Focado na mudança de código (diff)
- Design, legibilidade, risco técnico
- Impacto arquitetural

**Quality Assurance (QA):**

- Disciplina mais ampla de qualidade
- Estratégia de testes, critérios de aceitação
- Validação funcional e não funcional

**Code review é parte do sistema de qualidade, mas não substitui QA.**

---

# Boas Práticas para Review de Verdade

- **Separe blocos de tempo**: review fragmentado perde profundidade
- **Evite PRs gigantes**: diff maior = pior qualidade
- **Leia o contexto antes do código**: problema, decisão, impacto
- **Rode o código localmente** quando necessário
- **Faça duas passadas**:
  1. Entendimento global
  2. Leitura detalhada por arquivo
- **Registre decisões, não só correções**

---

# Por Onde Começar a Automação

## Sequência eficiente

1. **Nível 1** (qualidade mecânica) — ganho imediato de tempo
2. **Nível 2** (segurança e integridade) — redução de incidentes
3. **Nível 3** (comportamento) — confiança para deploy
4. **Níveis 4 e 5** — evolução de maturidade

> **Automatize tudo que é consenso mecânico e preserve energia humana para contexto, risco e design.**

---

# Onde os Reviews Costumam Dar Errado

- Review vira "caça a estilo" (sem formatter/linter)
- PR gigante (impossível de revisar com qualidade)
- Discussão arquitetural tardia, só no merge
- Aprovação sem leitura ("LGTM automático")
- Métrica de throughput que incentiva velocidade sem qualidade

---

# Checklist Prático por Camada

## Adapte para PR, MR ou Change

| Camada | Itens |
|--------|-------|
| **Base (automação)** | lint, format, SAST, segredos, dependências |
| **Comportamento** | testes relevantes, evidência de resultado |
| **Design** | impacto em fronteiras, acoplamento, legibilidade |
| **Negócio** | risco, rollout, observabilidade, rollback |

Quanto mais consistente o checklist, menos a qualidade depende de memória individual.

---

# Conclusão

Code review não é um carimbo para "liberar merge".

**É uma conversa técnica sobre qualidade, risco e evolução do sistema.**

A Pirâmide funciona porque separa responsabilidades:

- **Automação** para o repetitivo, objetivo e escalável
- **Julgamento humano** para o contextual, ambíguo e estratégico

---

# Meta Final

> No fim do dia, a meta não é revisar mais PRs.

**A meta é tomar melhores decisões de engenharia com menos ruído, menos retrabalho e mais previsibilidade.**

---

# Referências

- Fagan, M. E. (1976). Design and Code Inspections to Reduce Errors
- GitHub Blog (2008). "Oh yeah, there's pull requests now"
- Morling, G. The Code Review Pyramid
- Manifesto for Agile Software Development
- The Twelve-Factor App
- GitHub Docs, GitLab Docs, Atlassian

---

# Obrigado!

**Artigo completo:** vagnerclementino/blog

**Pirâmide original:** Gunnar Morling

---
