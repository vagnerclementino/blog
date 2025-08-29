import React from "react"
import { Helmet } from "react-helmet"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
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
  getDisqusConfig(post) {
    return {
      url: `${this.props.location.protocol}//${this.props.location.host}${this.props.location.pathname}`,
      identifier: post.id,
      title: post.frontmatter.title,
    }
  }

  getFeaturedImage(post) {
    return post.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData 
      ? getImage(post.frontmatter.featuredImage.childImageSharp.gatsbyImageData)
      : undefined
  }

  render() {
    const post = this.props.data.mdx
    const { previous, next } = this.props.pageContext
    const { fields } = post
    const { children } = this.props

    const disqusConfig = this.getDisqusConfig(post)
    const featuredImg = this.getFeaturedImage(post)

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" />
        </Helmet>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          featureImg={getFeatureImgPath(featuredImg)}
        />
        {featuredImg && (
          <GatsbyImage
            image={featuredImg}
            alt={post.frontmatter.featuredImage?.alt || post.frontmatter.title || ""}
          />
        )}
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
      </Layout>
    )
  }
}

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
