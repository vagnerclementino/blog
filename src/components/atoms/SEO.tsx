import React from "react"
import { Helmet } from "react-helmet-async"
import { useStaticQuery, graphql } from "gatsby"

interface SEOProps {
  description?: string
  lang?: string
  meta?: Array<{ name?: string; property?: string; content: string }>
  keywords?: string[]
  title: string
  featureImg?: string
}

const SEO: React.FC<SEOProps> = ({
  description = '',
  lang = 'en',
  meta = [],
  keywords = [],
  title,
  featureImg = ''
}) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const imagePath = `${site.siteMetadata.siteUrl}${featureImg}`
  const author = site.siteMetadata.author || ""

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={[
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/site.webmanifest",
        },
      ]}
      meta={[
        {
          name: "apple-mobile-web-app-title",
          content: "Clementino's Notes",
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: imagePath,
        },
        {
          property: `og:author`,
          content: author,
        },
        {
          name: `twitter:image`,
          content: imagePath,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
                name: `keywords`,
                content: keywords.join(`,`),
              }
            : []
        )
        .concat(meta)}
    />
  )
}

export default SEO