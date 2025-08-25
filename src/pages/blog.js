import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import SearchPosts from "../components/searchPosts"

class Blog extends React.Component {
  render() {
    const { data, navigate, location } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMdx.edges
    const localSearchBlog = data.localSearchBlog
    const homepageURL = process.env.HOMEPAGE_URL || 'https://clementino.me'

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <NavigationContainer>
          <HomeLink to="/">
            <FontAwesomeIcon icon={faHouse} />
            <span>Home</span>
          </HomeLink>
        </NavigationContainer>
        <Bio />
        <SearchPosts
          posts={posts}
          localSearchBlog={localSearchBlog}
          navigate={navigate}
          location={location}
        />
        <ExternalLinkContainer>
          <a href={homepageURL} target="_top">
            <Button marginTop="85px">Ir para o Website</Button>
          </a>
        </ExternalLinkContainer>
      </Layout>
    )
  }
}

const NavigationContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
`

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--textLink);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid var(--textLink);
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--textLink);
    color: white;
    transform: translateY(-1px);
  }
  
  svg {
    font-size: 1rem;
  }
  
  span {
    font-size: 0.875rem;
  }
`

const ExternalLinkContainer = styled.div`
  text-align: center;
`

export default Blog

export const pageQuery = graphql`{
  site {
    siteMetadata {
      title
    }
  }
  localSearchBlog {
    index
    store
  }
  allMdx(
    sort: {frontmatter: {date: DESC}}
    filter: {fields: {released: {eq: true}}}
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
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
}`
