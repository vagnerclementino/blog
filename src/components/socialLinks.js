import React from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faLinkedin, 
  faGithub, 
  faTwitter 
} from "@fortawesome/free-brands-svg-icons"
import { 
  faEnvelope, 
  faGlobe, 
  faRss 
} from "@fortawesome/free-solid-svg-icons"

const SocialLinks = () => {
  const socialData = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/vclementino",
      icon: faLinkedin,
      color: "#0077B5"
    },
    {
      name: "GitHub", 
      url: "https://github.com/vagnerclementino",
      icon: faGithub,
      color: "#333"
    },
    {
      name: "Twitter",
      url: "https://www.twitter.com/vclementino", 
      icon: faTwitter,
      color: "#1DA1F2"
    },
    {
      name: "Email",
      url: "mailto:vagner.clementino@gmail.com",
      icon: faEnvelope,
      color: "#EA4335"
    },
    {
      name: "Website",
      url: "https://clementino.me",
      icon: faGlobe,
      color: "#4285F4"
    },
    {
      name: "RSS",
      url: "/rss.xml",
      icon: faRss,
      color: "#FF6600"
    }
  ]

  return (
    <Container>
      <Title>Conecte-se comigo</Title>
      <LinksGrid>
        {socialData.map((social) => (
          <SocialLink
            key={social.name}
            href={social.url}
            target={social.name === "RSS" ? "_self" : "_blank"}
            rel={social.name === "RSS" ? "" : "noopener noreferrer"}
            title={social.name}
            $hoverColor={social.color}
          >
            <IconWrapper>
              <FontAwesomeIcon icon={social.icon} />
            </IconWrapper>
            <Label>{social.name}</Label>
          </SocialLink>
        ))}
      </LinksGrid>
    </Container>
  )
}

const Container = styled.section`
  margin: 2rem 0;
`

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: var(--textNormal);
  font-size: 1.25rem;
  text-align: center;
`

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    max-width: 280px;
    gap: 0.75rem;
  }
`

const SocialLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--textNormal);
  border-radius: 8px;
  text-decoration: none;
  color: var(--textNormal);
  transition: all 0.3s ease;
  aspect-ratio: 1;
  min-height: 80px;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.$hoverColor};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    
    svg {
      color: ${props => props.$hoverColor};
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 70px;
  }
`

const IconWrapper = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  svg {
    transition: color 0.3s ease;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.25rem;
  }
`

const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`

export default SocialLinks
