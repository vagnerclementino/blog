import React from "react"
import styled from "styled-components"

const SocialLinks = () => {
  const socialData = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/vclementino",
      icon: "💼"
    },
    {
      name: "GitHub", 
      url: "https://github.com/vagnerclementino",
      icon: "🐙"
    },
    {
      name: "Twitter",
      url: "https://www.twitter.com/vclementino", 
      icon: "🐦"
    },
    {
      name: "Email",
      url: "mailto:vagner.clementino@gmail.com",
      icon: "📧"
    },
    {
      name: "Website",
      url: "https://clementino.me",
      icon: "🌐"
    },
    {
      name: "RSS",
      url: "/rss.xml",
      icon: "📡"
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
          >
            <Icon>{social.icon}</Icon>
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
  margin-bottom: 1rem;
  color: var(--textNormal);
  font-size: 1.25rem;
`

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`

const SocialLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--textNormal);
  border-radius: 8px;
  text-decoration: none;
  color: var(--textNormal);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: var(--textLink);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

const Icon = styled.span`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
`

export default SocialLinks
