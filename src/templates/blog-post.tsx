import React from "react"
import { Helmet } from "react-helmet-async"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faList } from "@fortawesome/free-solid-svg-icons"

import Bio from "../components/atoms/Bio"
import Layout from "../components/Layout"
import SEO from "../components/atoms/SEO"
import ScrollToTop from "../components/atoms/ScrollToTop"
import ReadingProgress from "../components/atoms/ReadingProgress"
import { rhythm, scale } from "../utils/typography"
import { translateReadingTime } from "../utils/readingTime"
import { Disqus } from "gatsby-plugin-disqus"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const getFeatureImgPath = (featuredImg: any) => {
  if (featuredImg && featuredImg.images && featuredImg.images.fallback) {
    return featuredImg.images.fallback.src || ""
  } else {
    return ""
  }
}

interface BlogPostTemplateProps {
  data: {
    mdx: {
      id: string
      excerpt: string
      frontmatter: {
        title: string
        date: string
        description: string
        featuredImage?: {
          childImageSharp?: {
            gatsbyImageData: any
          }
        }
      }
      fields: {
        readingTime: {
          text: string
          minutes: number
        }
      }
    }
  }
  pageContext: {
    previous?: {
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
      }
    }
    next?: {
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
      }
    }
  }
  location: {
    protocol: string
    host: string
    pathname: string
  }
  children: React.ReactNode
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ data, pageContext, location, children }) => {
  const post = data.mdx
  const { previous, next } = pageContext

  const disqusConfig = {
    url: `${location.protocol}//${location.host}${location.pathname}`,
    identifier: post.id,
    title: post.frontmatter.title,
  }

  const featuredImg = post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData 
    ? getImage(post.frontmatter.featuredImage.childImageSharp.gatsbyImageData)
    : undefined

  return (
    <Layout location={location}>
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

      { featuredImg && (
        <GatsbyImage
          image={featuredImg}
          alt={post.frontmatter.featuredImage?.alt || post.frontmatter.title || ""}
        />
      )}

      <h1>{post.frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: "block",
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {post.frontmatter.date}
      </p>

      <p
        style={{
          ...scale(-1 / 5),
          display: "block",
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        <strong>Tempo de leitura: {translateReadingTime(post.fields.readingTime)}</strong>
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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          listStyle: "none",
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

export default BlogPostTemplate