# Tarefas de Migração para TypeScript
## Arquitetura Atómica (Design System Approach)

### Estrutura de Componentes
- **Átomos**: Componentes básicos (buttons, inputs, icons, labels, etc.)
- **Moléculas**: Combinações simples de átomos (form groups, navigation items, cards)
- **Organismos**: Combinaçõescomplexas de moléculas (header, footer, article cards, sidebar)
- **Páginas**: Composições de organismos (homepage, article page, about page)

---

## 1. Preparação ✓
- [x] Criação da branch `typescript-migration`
- [x] Atualização dos dependências para TypeScript
- [x] Configuração do `tsconfig.json`
- [x] Commit e push (Branch criada: typescript-migration)
- [x] Atualização do README.md para documentar a migração

---

## 2. Desenvolvimento - Migração incremental por nível atómico

### Fase 2.1: Configuração de TypeScript para Componentes Atómicos
- [x] Criar estrutura de diretórios:
  - `src/components/atoms/` (button, avatar, icon, etc.)
  - `src/components/molecules/` (postCard, searchBar, navigationItem, etc.)
  - `src/components/organisms/` (header, footer, articleList, sidebar, etc.)
  - `src/components/pages/` (página-level compositions)
- [x] Criar arquivos de tipos globais `src/types/index.ts`
- [ ] Configurar `babel.config.js` para TypeScript
- [ ] Atualizar ESLint para suporte a TypeScript
- [x] Mapear componentes atuais para nova estrutura (classificação)
- [x] Converter átomos iniciais (Button, Avatar)
- [x] Converter moléculas iniciais (PostCard)
- [x] Converter organismos iniciais (PostCarousel)
- [x] Commit + push: "feat: migra componentes iniciais para TypeScript (atoms, molecules, organisms)"

### Fase 2.2: Migração de Átomos
- [ ] Converter `src/components/atoms/` (se existirem) ou criar átomos básicos:
  - [ ] `Button.tsx` (button component)
  - [ ] `Input.tsx` (input fields)
  - [ ] `Icon.tsx` (icon wrapper)
  - [ ] `Image.tsx` (optimized image)
  - [ ] `Link.tsx` (link wrapper)
- [ ] Testar cada átomo individualmente
- [ ] Commit + push por componente (um por dia)

### Fase 2.3: Migração de Moléculas
- [ ] Converter combinações de átomos:
  - [ ] `SearchBar.tsx` (input + button)
  - [ ] `ArticleCard.tsx` (image + title + excerpt)
  - [ ] `NavigationItem.tsx` (link + icon)
  - [ ] `SocialShare.tsx` (buttons de redes sociais)
- [ ] Testar integração entre átomos
- [ ] Commit + push por molécula

### Fase 2.4: Migração de Organismos
- [ ] Converter componentes complexos:
  - [ ] `Header.tsx` (navigation + logo + search)
  - [ ] `Footer.tsx` (links + copyright + social)
  - [ ] `ArticleList.tsx` (grid de article cards)
  - [ ] `Sidebar.tsx` (widgets + about)
- [ ] Testar organismos com moléculas
- [ ] Commit + push por organismo

### Fase 2.5: Migração de Páginas
- [ ] Converter páginas Gatsby:
  - [ ] `src/pages/index.tsx` (homepage)
  - [ ] `src/pages/blog/{slug}.tsx` (article page)
  - [ ] `src/pages/about.tsx`
  - [ ] `src/pages/404.tsx`
- [ ] Testar rotas e navegação
- [ ] Commit + push por página

### Fase 2.6: Atualização de Configurações e Plugins
- [ ] Converter `gatsby-config.mjs` para TypeScript
- [ ] Converter `gatsby-node.js` para TypeScript
- [ ] Converter `gatsby-browser.js` para TypeScript
- [ ] Converter `gulpfile.js` para TypeScript (se necessário)
- [ ] Atualizar `jest.config.js` para TypeScript
- [ ] Commit + push final de configurações

---

## 3. Testes
- [ ] Escrever testes unitários para átomos convertidos
- [ ] Escrever testes para moléculas
- [ ] Escrever testes para organismos
- [ ] Verificar compatibilidade com MDX e plugins Gatsby
- [ ] Executar CI/CD a cada commit
- [ ] Garantir 100% de cobertura de tipos

---

## 4. Implantação
- [ ] Build de teste em ambiente staging
- [ ] Verificação de saúde atómica (cada componente funciona isoladamente)
- [ ] Deploy incremental por feature (cada commit pode ser deployado separadamente)
- [ ] Monitorar métricas de performance
- [ ] Plan de rollback documentado
- [ ] Deploy em produção após validação completa

---

**Cronograma sugerido**:
- **Dia 1**: Fase 2.1 (preparação)
- **Dias 2-5**: Fase 2.2 (átomos) - 1 átomo por dia
- **Dias 6-8**: Fase 2.3 (moléculas) - 1 molécula por dia  
- **Dias 9-10**: Fase 2.4 (organismos)
- **Dia 11**: Fase 2.5 (páginas)
- **Dia 12**: Fase 2.6 (configurações)
- **Dias 13-14**: Fase 3 (testes)
- **Dia 15**: Fase 4 (implantação)