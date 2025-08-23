import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const FeaturedPosts = ({ posts }) => {
  // Para demonstração, vamos considerar os primeiros 3 posts como "em destaque"
  // Em uma implementação real, você poderia adicionar um campo "featured" no frontmatter
  const featuredPosts = posts.slice(0, 3)

  if (!featuredPosts.length) {
    return null
  }

  return (
    <Container>
      <Title>⭐ Posts em Destaque</Title>
      <PostsGrid>
        {featuredPosts.map(({ node: post }) => {
          const title = post.frontmatter.title || post.fields.slug
          const description = post.frontmatter.description || post.excerpt

          return (
            <FeaturedCard key={post.fields.slug}>
              <CardContent>
                <CardTitle>
                  <StyledLink to={post.fields.slug}>
                    {title}
                  </StyledLink>
                </CardTitle>
                <Date>{post.frontmatter.date}</Date>
                <Description>{description}</Description>
                <ReadMore to={post.fields.slug}>
                  Ler post completo →
                </ReadMore>
              </CardContent>
              <FeaturedBadge>Destaque</FeaturedBadge>
            </FeaturedCard>
          )
        })}
      </PostsGrid>
    </Container>
  )
}

const Container = styled.section`
  margin: 3rem 0;
`

const Title = styled.h2`
  margin-bottom: 2rem;
  color: var(--textNormal);
  font-size: 1.5rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

const FeaturedCard = styled.article`
  position: relative;
  background: var(--bg);
  border: 2px solid var(--textLink);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const StyledLink = styled(Link)`
  color: var(--textNormal);
  text-decoration: none;
  
  &:hover {
    color: var(--textLink);
  }
`

const Date = styled.small`
  color: var(--textSecondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
`

const Description = styled.p`
  color: var(--textSecondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`

const ReadMore = styled(Link)`
  color: var(--textLink);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  align-self: flex-start;
  
  &:hover {
    text-decoration: underline;
  }
`

const FeaturedBadge = styled.span`
  position: absolute;
  top: -1px;
  right: 1rem;
  background: var(--textLink);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 8px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export default FeaturedPosts
