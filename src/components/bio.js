/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

/**
 * Displays the author's bio with a link to their Twitter profile.
 *
 * Fetches author information and social media handle from site metadata using a static GraphQL query, and renders them in a styled container.
 *
 * @returns {JSX.Element} A container with the author's name and a Twitter link.
 */
function Bio() {
  const data = useStaticQuery(bioQuery)
  
  const { author, social } = data.site.siteMetadata
  
  return (
    <Container>
      <p>
        Written by <strong>{author}</strong>.
        {` `}
        <a href={`https://twitter.com/${social.twitter}`} 
           target="_blank" 
           rel="noopener noreferrer">
          Follow me on Twitter
        </a>
      </p>
    </Container>
  )
}

const bioQuery = graphql`query BioQuery {
  avatar: file(absolutePath: {regex: "/gatsby-icon.png/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
    }
  }
  site {
    siteMetadata {
      author
      social {
        twitter
      }
    }
  }
}`

const Container = styled.div`
  display: flex;
`

export default Bio
