import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import WideLayout from "../components/wideLayout"
import SEO from "../components/seo"
import Button from "../components/button"
import PostCarousel from "../components/postCarousel"
import SocialLinks from "../components/socialLinks"
import Avatar from "../components/avatar"
import { faFire } from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-solid-svg-icons"

class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges

    return (
      <WideLayout location={this.props.location} title={siteTitle}>
        <SEO
          title="Home"
          keywords={[`blog`, `clementino.me`, `solid`, `design patterns`, `desenvolvimento`, `tecnologia`]}
        />
        
        <HeroSection>
          <HeroContent>
            <AvatarContainer>
              <Avatar size={120} />
            </AvatarContainer>
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

        <PostCarousel 
          posts={posts} 
          title="Posts em Destaque"
          icon={faHeart}
          featured={true}
          badge="Destaque"
          autoplay={true}
        />

        <PostCarousel 
          posts={posts} 
          title="Últimos Posts" 
          icon={faFire}
          count={5}
        />

        <SidebarSection>
          <SocialLinks />
        </SidebarSection>
      </WideLayout>
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

const AvatarContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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
            featured
          }
        }
      }
    }
  }
`
