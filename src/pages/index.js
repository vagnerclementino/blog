import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import PostCard from "../components/postCard"
import FeaturedPosts from "../components/featuredPosts"
import SocialLinks from "../components/socialLinks"
import NewsletterSignup from "../components/newsletterSignup"

class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges
    const recentPosts = posts.slice(0, 6) // Últimos 6 posts

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `clementino.me`, `solid`, `design patterns`, `desenvolvimento`, `tecnologia`]}
        />
        
        <HeroSection>
          <HeroContent>
            <WelcomeTitle>
              Olá! Bem-vindo ao meu blog{" "}
              <span role="img" aria-label="wave emoji">
                👋
              </span>
            </WelcomeTitle>
            <HeroDescription>
              Sou <strong>Vagner Clementino</strong>, desenvolvedor apaixonado por tecnologia, 
              design patterns e boas práticas de desenvolvimento. Aqui compartilho conhecimentos, 
              experiências e reflexões sobre o mundo da programação.
            </HeroDescription>
            <HeroActions>
              <Link to="/blog/">
                <Button marginTop="0">Ver todos os posts</Button>
              </Link>
              <ExternalLink 
                href="https://clementino.me" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Conheça meu portfólio →
              </ExternalLink>
            </HeroActions>
          </HeroContent>
        </HeroSection>

        <FeaturedPosts posts={posts} />

        <RecentPostsSection>
          <SectionTitle>📝 Últimos Posts</SectionTitle>
          <PostsGrid>
            {recentPosts.map(({ node: post }) => (
              <PostCard key={post.fields.slug} post={post} />
            ))}
          </PostsGrid>
          <ViewAllContainer>
            <Link to="/blog/">
              <Button>Ver todos os posts</Button>
            </Link>
          </ViewAllContainer>
        </RecentPostsSection>

        <SidebarSection>
          <SocialLinks />
          <NewsletterSignup />
        </SidebarSection>
      </Layout>
    )
  }
}

const HeroSection = styled.section`
  margin: 2rem 0 4rem 0;
  text-align: center;
  
  @media (max-width: 768px) {
    margin: 1rem 0 3rem 0;
  }
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--textNormal);
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`

const HeroDescription = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--textSecondary);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`

const HeroActions = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

const ExternalLink = styled.a`
  color: var(--textLink);
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`

const RecentPostsSection = styled.section`
  margin: 4rem 0;
`

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 2rem;
  color: var(--textNormal);
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`

const ViewAllContainer = styled.div`
  text-align: center;
`

const SidebarSection = styled.aside`
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    margin: 3rem 0;
  }
`

export default IndexPage

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
          }
        }
      }
    }
  }
`
