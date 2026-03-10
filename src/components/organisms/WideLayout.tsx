import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

import { rhythm, scale } from "../utils/typography"

interface WideLayoutProps {
  location: any
  title: string
  children: React.ReactNode
}

const WideLayout: React.FC<WideLayoutProps> = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const blogPath = `${__PATH_PREFIX__}/blog/`
  let Header: React.ReactNode

  if (location.pathname === rootPath || location.pathname === blogPath) {
    Header = (
      <CenteredHeader
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit",
          }}
          to={location.pathname === blogPath ? `/blog/` : `/`}
        >
          {title}
        </Link>
      </CenteredHeader>
    )
  } else {
    Header = (
      <CenteredSubHeader
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit",
          }}
          to={`/blog/`}
        >
          {title}
        </Link>
      </CenteredSubHeader>
    )
  }

  return (
    <Wrapper>
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: `80rem`,
          padding: `${rhythm(.1)} ${rhythm(3 / 4)}`,
        }}
      >
        <header>{Header}</header>
        <main}>{children}</main>
      </div>
      <Footer>
        © {new Date().getFullYear()}, Built with{" "}
        <a
          href="https://www.gatsbyjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gatsby
        </a>
      </Footer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  min-height: 100vh;
`

const CenteredHeader = styled.h1`
  text-align: center;
`

const CenteredSubHeader = styled.h3`
  text-align: center;
`

const Footer = styled.footer`
  text-align: center;
  margin: 24px;
`

export default WideLayout