---
title: "Pirâmide de Code Review: o que automatizar e o que manter humano"
date: "2026-02-20"
description: "Como estruturar revisão de código com automação na base e julgamento técnico no topo, reduzindo ruído e risco."
featuredImage: feature.png
---

## Introdução

Code review é uma daquelas práticas que ficam lindas no slide e viram caos no
mundo real. Todo time diz que revisa código; poucos conseguem fazer isso com
consistência, profundidade e velocidade ao mesmo tempo.

Neste artigo, vou seguir um fluxo de ideias específico:

**Engenharia de Software → Desenvolvimento Ágil → Controle de Versão → Git →
GitHub/Pull Request → Pirâmide de Code Review → Ferramentas de automação → IA**.

Depois de qualquer iniciativa de qualidade, a pergunta inevitável aparece:
**“o que dá para automatizar sem esvaziar o valor humano da revisão?”**

A forma mais útil que encontrei para responder isso foi pensar em uma
**Pirâmide de Code Review**: uma estrutura por camadas em que a base é altamente
automatizável e o topo depende (e continuará dependendo) de julgamento técnico,
contexto de negócio e responsabilidade.

Antes da pirâmide, vale um passo para trás: de onde vem essa prática e como
chegamos ao Pull Request.

## Uma breve história do Code Review

A revisão de artefatos de software não começou no GitHub. Na literatura clássica,
um marco importante é o trabalho de **Michael Fagan (IBM, 1976)**, que formalizou
as inspeções de software como processo estruturado para encontrar defeitos cedo[^1][^2].

Décadas depois, com sistemas distribuídos e desenvolvimento open source,
processos mais leves ganharam força: patches por e-mail, discussões em lista,
revisão incremental e reenvio de versões.

Com plataformas modernas de colaboração, a revisão passou a acontecer em um
objeto único com diff, comentários, checks automáticos e decisão de merge.
Esse objeto recebeu nomes diferentes ao longo do ecossistema:

- **Pull Request (PR)**: popularizado por GitHub e Bitbucket[^3][^4]
- **Merge Request (MR)**: nomenclatura adotada pelo GitLab[^5]
- **Change / Patch Set**: fluxo tradicional no Gerrit[^6]
- **Change List (CL)**: termo comum em organizações com fluxo interno de revisão
- **Differential Revision**: termo associado ao Phabricator/Differential

Mudou o nome, não a essência: propor uma mudança, revisar coletivamente e só
então integrar na branch principal.

Um marco importante aqui é o lançamento público da feature de Pull Request no
GitHub, em **23 de fevereiro de 2008**, no post “Oh yeah, there’s pull requests
now”[^11]. Esse momento ajudou a consolidar o review assíncrono baseado em
branch/fork como padrão da indústria.

## Da Engenharia de Software ao Pull Request: a linha evolutiva

Antes da pirâmide em si, vale explicitar a sequência histórica e prática:

1. **Engenharia de Software** organiza o desenvolvimento como disciplina,
   com foco em processo, qualidade e manutenção.
2. **Desenvolvimento Ágil** acelera ciclos de feedback e entrega contínua,
   exigindo colaboração frequente e excelência técnica[^7].
3. **Sistemas de controle de versão** viabilizam colaboração segura em código.
4. **Git** populariza o modelo distribuído e fluxos não lineares em larga escala[^12].
5. **GitHub** torna esse fluxo social e assíncrono, consolidando o Pull Request
   como unidade de colaboração/revisão[^3][^11].
6. **Pirâmide de Code Review** organiza onde gastar energia humana e onde automatizar.
7. **Ferramentas de automação** reduzem ruído (lint, testes, SAST, CI checks).
8. **IA** entra como copiloto para acelerar análise, sumarização e sugestão de
   melhorias — sem substituir responsabilidade técnica.

Essa ordem importa porque evita a tentação de discutir IA no vácuo:
primeiro a gente estrutura processo e critério de qualidade; depois aplica
automação e IA com objetivo claro.

## A Pirâmide de Code Review

A base visual deste artigo é inspirada no trabalho original de **Gunnar Morling**,
no post *The Code Review Pyramid*[^9]. Abaixo, estou usando a imagem original
(em SVG) como referência visual central[^10]:

![Code Review Pyramid — Gunnar Morling](./code-review-pyramid.svg)

A pirâmide ajuda a responder três perguntas:

1. O que **deve** ser automatizado?
2. O que **pode** ser parcialmente automatizado?
3. O que **não deveria** ser automatizado (ou ainda depende de humano)?

### Nível 1 — Higiene Mecânica (base, 100% automatizável)

Aqui moram regras sem subjetividade. Se é determinístico, não deve consumir
tempo de revisor humano.

**Exemplos**

- formatação (Prettier, Black, gofmt)
- lint e convenções
- checagem de imports, dead code, dependências óbvias
- segredos em commit e vulnerabilidades conhecidas

**Objetivo**

Remover ruído. O reviewer não deveria comentar espaço, ponto e vírgula ou
arquivo sem newline.

### Nível 2 — Segurança e Integridade (automatização alta)

Ainda muito automatizável, mas com contexto um pouco maior.

**Exemplos**

- SAST e scanners de dependência
- política de branch protection
- validação de permissões, ownership e arquivos sensíveis
- checks obrigatórios de CI

**Objetivo**

Barrar regressões graves antes de qualquer discussão subjetiva.

### Nível 3 — Comportamento e Contrato (automatização média-alta)

Aqui entram testes e evidências de comportamento. É automação forte, mas exige
bom design de suíte e disciplina de manutenção.

**Exemplos**

- testes unitários, integração e contrato
- cobertura mínima por módulo crítico
- verificação de compatibilidade de API
- snapshots/approvals para artefatos previsíveis

**Objetivo**

Responder: “essa mudança ainda faz o que deveria fazer?”

### Nível 4 — Design Técnico e Arquitetura (automatização parcial)

Agora começa a zona cinza. Ferramentas ajudam com sinais, mas não substituem
julgamento.

**Exemplos**

- impacto em acoplamento e limites arquiteturais
- legibilidade, coesão, nomes e modelagem
- trade-offs de performance e manutenção
- aderência ao estilo arquitetural do sistema

**Pode automatizar parcialmente?**

Sim: métricas, detectors de complexidade e até assistentes de IA.
Mas a decisão final ainda é humana.

### Nível 5 — Produto, Risco e Estratégia (topo, predominantemente humano)

No topo da pirâmide, a pergunta deixa de ser técnica e vira decisão de produto.

**Exemplos**

- isso resolve o problema certo?
- o risco operacional é aceitável para o momento?
- a mudança está alinhada à estratégia do time?
- o custo de manter essa solução compensa o ganho?

Aqui, automação apoia contexto, mas não decide prioridade nem responsabilidade.

## O que automatizar primeiro (ordem prática)

Se o seu time está começando agora, a sequência mais eficiente costuma ser:

1. **Nível 1** (higiene) — ganho imediato de tempo
2. **Nível 2** (segurança/integridade) — redução de incidentes
3. **Nível 3** (comportamento) — confiança para deploy
4. **Níveis 4 e 5** — evolução de maturidade e cultura técnica

Uma regra simples: **automatize tudo que é consenso mecânico** e preserve
energia humana para análise de contexto, risco e design.

## Anti-padrões comuns

- Review virar “caça a estilo” porque não há formatter/linter
- PR gigante (impossível de revisar com qualidade)
- Discussão arquitetural tardia só no momento do merge
- Aprovação sem leitura (“LGTM automático”)
- Métrica de throughput que incentiva velocidade sem qualidade

## Um template de checklist por camada

Você pode adaptar este checklist para PR/MR/Change:

- **Base (automação):** lint, format, SAST, segredos, dependências
- **Comportamento:** testes relevantes e evidência de resultado
- **Design:** impacto em fronteiras, acoplamento, legibilidade
- **Negócio:** risco, rollout, observabilidade e plano de rollback

Quanto mais consistente esse checklist, menos a qualidade depende de memória
individual.

## Code Review, Manifesto Ágil e os 12 Fatores

Se olharmos com calma, a pirâmide conversa diretamente com valores e princípios
ágteis.

No **Manifesto Ágil**, dois pontos aparecem com força no contexto de review:

- **"Indivíduos e interações"**: review é interação técnica de alta qualidade,
  não apenas gate de processo.
- **"Atenção contínua à excelência técnica"**: revisar código é manter o sistema
  evolutivo, legível e sustentável[^7].

Também existe aderência com práticas clássicas de desenvolvimento ágil, como
feedback curto, integração frequente e melhoria contínua. Em outras palavras,
PR pequeno e revisado cedo tende a gerar menos retrabalho do que um "big bang"
de código no fim do ciclo.

Quando conectamos com o **12-Factor App**, a conversa fica ainda mais prática:

- **Codebase (I)**: uma codebase versionada e compartilhada favorece revisão
  transparente[^8].
- **Build, release, run (V)**: separação de estágios ajuda a definir checks
  automáticos por camada da pirâmide.
- **Dev/prod parity (X)**: quanto menor o desvio entre ambientes, mais confiável
  é o resultado dos checks que antecedem o review humano.
- **Logs (XI)** e observabilidade: reviewers tomam decisões melhores quando o PR
  traz sinais de impacto operacional.

O resumo dessa integração é simples: **a pirâmide não compete com ágil nem com
12 fatores — ela operacionaliza ambos no fluxo de revisão**.

## Conclusão

Code review não é carimbo para “liberar merge”.
É uma conversa técnica sobre qualidade, risco e evolução do sistema.

A **Pirâmide de Code Review** funciona porque separa bem as responsabilidades:

- **automação** para aquilo que é repetitivo, objetivo e escalável
- **julgamento humano** para aquilo que é contextual, ambíguo e estratégico

No fim do dia, a meta não é revisar mais PRs.
A meta é tomar melhores decisões de engenharia com menos ruído,
menos retrabalho e mais previsibilidade.

---

[^1]: [Michael E. Fagan (1976) — Design and Code Inspections to Reduce Errors in Program Development](https://dl.acm.org/doi/10.1145/800253.807736)
[^2]: [Fagan inspection (visão geral)](https://en.wikipedia.org/wiki/Fagan_inspection)
[^3]: [GitHub Docs — About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
[^4]: [Atlassian — Pull request workflow](https://www.atlassian.com/git/tutorials/making-a-pull-request)
[^5]: [GitLab Docs — Merge requests](https://docs.gitlab.com/user/project/merge_requests/)
[^6]: [Gerrit — Code review workflow](https://gerrit-review.googlesource.com/Documentation/intro-user.html)
[^7]: [Manifesto for Agile Software Development](https://agilemanifesto.org/)
[^8]: [The Twelve-Factor App](https://12factor.net/)
[^9]: [Gunnar Morling — The Code Review Pyramid](https://www.morling.dev/blog/the-code-review-pyramid/)
[^10]: [Code Review Pyramid (SVG original)](https://www.morling.dev/images/code_review_pyramid.svg)
[^11]: [GitHub Blog (2008) — “Oh yeah, there’s pull requests now”](https://github.blog/news-insights/the-library/oh-yeah-there-s-pull-requests-now/)
[^12]: [Git — About (git-scm.com)](https://git-scm.com/about)
