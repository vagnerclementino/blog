# Como Definir Posts em Destaque

Este documento explica como configurar posts para aparecerem na seção "Posts em Destaque" da homepage do blog.

## Implementação Atual

Atualmente, o sistema automaticamente seleciona os **3 primeiros posts** (mais recentes) como posts em destaque. Isso é feito no componente `FeaturedPosts`:

```javascript
// Em src/components/featuredPosts.js
const featuredPosts = posts.slice(0, 3)
```

## Como Implementar Controle Manual (Recomendado)

Para ter controle total sobre quais posts aparecem em destaque, siga estes passos:

### 1. Adicionar Campo `featured` no Frontmatter

Adicione o campo `featured: true` no frontmatter dos posts que você deseja destacar:

```markdown
---
title: "Meu Post Incrível"
date: "2024-01-15"
description: "Uma descrição interessante do post"
featured: true
---

Conteúdo do post aqui...
```

### 2. Atualizar a Query GraphQL

Modifique a query na página inicial (`src/pages/index.js`) para incluir o campo `featured`:

```javascript
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { fields: { released: { eq: true } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            released
            releasedNotForced
          }
          frontmatter {
            date(formatString: "DD/MM/YYYY")
            title
            description
            featured  # Adicionar esta linha
          }
        }
      }
    }
  }
`
```

### 3. Atualizar o Componente FeaturedPosts

Modifique o componente para filtrar posts com `featured: true`:

```javascript
// Em src/components/featuredPosts.js
const FeaturedPosts = ({ posts }) => {
  // Filtrar posts marcados como featured
  const featuredPosts = posts.filter(({ node }) => node.frontmatter.featured)
  
  // Fallback: se não houver posts featured, usar os 3 mais recentes
  const postsToShow = featuredPosts.length > 0 
    ? featuredPosts.slice(0, 3) 
    : posts.slice(0, 3)

  if (!postsToShow.length) {
    return null
  }

  // Resto do componente...
}
```

## Vantagens do Sistema Manual

1. **Controle Total**: Você decide exatamente quais posts destacar
2. **Flexibilidade**: Pode destacar posts mais antigos mas importantes
3. **Curadoria**: Permite criar uma seleção editorial dos melhores conteúdos
4. **Estabilidade**: Posts em destaque não mudam automaticamente

## Exemplo de Uso

### Post Normal
```markdown
---
title: "Post Regular"
date: "2024-01-10"
description: "Um post normal"
---
```

### Post em Destaque
```markdown
---
title: "Post Especial"
date: "2024-01-05"
description: "Este post será destacado na homepage"
featured: true
---
```

## Considerações

- **Limite**: Recomenda-se manter no máximo 3-5 posts em destaque
- **Performance**: Posts em destaque aparecem no carrossel da homepage
- **SEO**: Posts em destaque têm maior visibilidade e podem impactar o SEO
- **UX**: Mantenha uma rotação regular dos posts em destaque para manter o conteúdo fresco

## Implementação Futura

Para implementar o sistema manual, você precisará:

1. Atualizar todos os posts existentes (adicionar `featured: false` ou remover o campo)
2. Marcar os posts desejados com `featured: true`
3. Modificar o código conforme descrito acima
4. Testar a funcionalidade
5. Atualizar a documentação do projeto

## Estrutura Atual do Carrossel

O carrossel de posts em destaque inclui:
- ✨ Ícone de estrela (Font Awesome)
- 🎠 Navegação por setas
- 📱 Design responsivo (1 slide no mobile, 2 no tablet, 3 no desktop)
- ⏰ Autoplay com 5 segundos de intervalo
- 🏷️ Badge "Destaque" em cada card
- 🔗 Links "Ler mais →" padronizados
