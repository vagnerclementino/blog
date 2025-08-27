import React from "react"
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faList, faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ScrollToTop from "../components/scrollToTop"
import ReadingProgress from "../components/readingProgress"
import { rhythm, scale } from "../utils/typography"
import { translateReadingTime } from "../utils/readingTime"
import { Disqus } from "gatsby-plugin-disqus"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const getFeatureImgPath = featuredImg => {
  if (featuredImg && featuredImg.images && featuredImg.images.fallback) {
    return featuredImg.images.fallback.src || ""
  } else {
    return ""
  }
}


class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.mdx
    const { previous, next } = this.props.pageContext
    const { fields } = post
    const { children } = this.props

    const disqusConfig = {
      url: `${this.props.location.protocol}//${this.props.location.host}${this.props.location.pathname}`,
      identifier: post.id,
      title: post.frontmatter.title,
    }

    let featuredImg = getImage(post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData)

    return (
      <Layout location={this.props.location}>
        <ReadingProgress />
        <Helmet>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" />
        </Helmet>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          featureImg={getFeatureImgPath(featuredImg)}
        />
        
        <NavigationBar>
          <NavButton to="/" title="Voltar para Home">
            <FontAwesomeIcon icon={faHome} />
            <span>Home</span>
          </NavButton>
          <NavButton to="/blog/" title="Voltar para Blog">
            <FontAwesomeIcon icon={faList} />
            <span>Todos os Posts</span>
          </NavButton>
        </NavigationBar>

        <GatsbyImage
          image={featuredImg}
          alt={post.frontmatter.description || post.excerpt}
        />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>

        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          <strong>Tempo de leitura: {translateReadingTime(fields.readingTime)}</strong>
        </p>
        {children}
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <Bio />

        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={`/blog${previous.fields.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`/blog${next.fields.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>

        <Disqus config={disqusConfig} />
        
        <ScrollToTop showOffset={400} />
      </Layout>
    )
  }
}

const NavigationBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--textSecondary);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg);
  border: 2px solid var(--textLink);
  border-radius: 8px;
  color: var(--textLink);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--textLink);
    color: var(--bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    font-size: 1rem;
  }
  
  span {
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 0.6rem 0.8rem;
    
    span {
      font-size: 0.8rem;
    }
  }
`

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
      fields {
        readingTime {
          text
          minutes
        }
      }
    }
  }
`
