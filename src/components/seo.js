/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

/**
 * React component that injects SEO and social media meta tags into the document head for a Gatsby site.
 *
 * Sets standard, Open Graph, and Twitter meta tags based on provided props and site metadata. Automatically falls back to site defaults for description and author if not specified.
 *
 * @param {Object} props - SEO configuration options.
 * @param {string} props.title - The page title to display in the browser and meta tags.
 * @param {string} [props.description] - Custom meta description; falls back to site default if omitted.
 * @param {string} [props.lang] - Language attribute for the HTML tag.
 * @param {Array} [props.meta] - Additional meta tag objects to append.
 * @param {Array<string>} [props.keywords] - List of keywords for the keywords meta tag.
 * @param {string} [props.featureImg] - Path to the feature image for Open Graph and Twitter cards.
 *
 * @returns {JSX.Element} Helmet component with configured meta tags.
 */
function SEO({ 
  description = '',
  lang = 'en',
  meta = [],
  keywords = [],
  title,
  featureImg 
}) {
  const { site } = useStaticQuery(
    graphql`
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
    `
  )

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
      meta={[
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
                content: keywords.join(`, `),
              }
            : []
        )
        .concat(meta)}
    />
  )
}


SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
}

export default SEO
