import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

interface BioProps {
  className?: string
}

function Bio({ className }: BioProps) {
  const data = useStaticQuery(bioQuery)
  
  const { author, social } = data.site.siteMetadata
  
  return (
    <Container className={className}>
      <p>
        Written by <strong>{author}</strong>.{` `}
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