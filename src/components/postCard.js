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
            <StyledLink to={post.fields.slug}>
              {title}
            </StyledLink>
          </Title>
          <Date>{post.frontmatter.date}</Date>
        </CardHeader>
        <Description>{description}</Description>
        <ReadMore to={post.fields.slug}>
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: var(--textLink);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CardHeader = styled.header`
  margin-bottom: 1rem;
`

const Title = styled.h3`
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
`

const Description = styled.p`
  color: var(--textSecondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex-grow: 1;
`

const ReadMore = styled(Link)`
  color: var(--textLink);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  align-self: flex-start;
  
  &:hover {
    text-decoration: underline;
  }
`

export default PostCard
