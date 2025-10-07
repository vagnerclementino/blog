import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const PostCard = ({ post }) => {
  const title = post.frontmatter.title || post.fields.slug
  const description = post.frontmatter.description || post.excerpt

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <Title>
            <StyledLink to={`/blog${post.fields.slug}`}>
              {title}
            </StyledLink>
          </Title>
          <PublishedDate>{post.frontmatter.date}</PublishedDate>
        </CardHeader>
        <Description>{description}</Description>
        <ReadMore to={`/blog${post.fields.slug}`}>
          Ler mais →
        </ReadMore>
      </CardContent>
    </Card>
  )
}

const Card = styled.article`
  background: var(--bg);
  border: 1px solid var(--textNormal);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 320px;
  width: 320px;
  max-width: 350px;
  min-width: 280px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: var(--textLink);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 auto 1rem auto;
    height: auto;
    min-height: 300px;
    width: 100%;
    max-width: 350px;
    min-width: 280px;
  }
  
  @media (max-width: 480px) {
    width: auto;
    max-width: none;
    min-width: auto;
    margin: 0;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CardHeader = styled.header`
  margin-bottom: 1rem;
  flex-shrink: 0; /* Não encolhe */
`

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem !important;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.125rem !important;
  }
`

const StyledLink = styled(Link)`
  color: var(--textNormal);
  text-decoration: none;
  
  &:hover {
    color: var(--textLink);
  }
`

const PublishedDate = styled.small`
  color: var(--textSecondary);
  font-size: 0.875rem;
`

const Description = styled.p`
  color: var(--textSecondary);
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const ReadMore = styled(Link)`
  color: var(--textLink);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  align-self: flex-start;
  margin-top: auto; /* Empurra para o final */
  flex-shrink: 0; /* Não encolhe */
  
  &:hover {
    text-decoration: underline;
  }
`

export default PostCard
