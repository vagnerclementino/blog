import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import styled from "styled-components"

const Avatar = ({ size = 80, className }) => {
  const data = useStaticQuery(graphql`
    query AvatarQuery {
      avatar: file(relativePath: { eq: "avatar.png" }) {
        childImageSharp {
          gatsbyImageData(
            width: 200
            height: 200
            placeholder: BLURRED
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
  `)

  const image = getImage(data.avatar)

  if (!image) {
    return (
      <Placeholder size={size} className={className}>
        <span>👤</span>
      </Placeholder>
    )
  }

  return (
    <AvatarContainer size={size} className={className}>
      <StyledGatsbyImage
        image={image}
        alt="Vagner Clementino"
        loading="eager"
      />
    </AvatarContainer>
  )
}

const AvatarContainer = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--textLink);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
`

const StyledGatsbyImage = styled(GatsbyImage)`
  width: 100%;
  height: 100%;
  
  img {
    object-fit: cover;
  }
`

const Placeholder = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: var(--textSecondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size * 0.4}px;
  color: white;
  border: 3px solid var(--textLink);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`

export default Avatar
