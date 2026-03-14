import React from "react"
import { Link } from "gatsby"

interface SocialLinkProps {
  href: string
  children: React.ReactNode
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, children }) => (
  <Link to={href}>
    {children}
  </Link>
)

export