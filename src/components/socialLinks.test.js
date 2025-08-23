import React from "react"
import { render, screen } from "@testing-library/react"
import SocialLinks from "./socialLinks"

describe("SocialLinks", () => {
  it("renders all social links", () => {
    render(<SocialLinks />)
    
    expect(screen.getByText("Conecte-se comigo")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Email" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Website" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "RSS" })).toBeInTheDocument()
  })

  it("has correct URLs for social links", () => {
    render(<SocialLinks />)
    
    expect(screen.getByRole("link", { name: "LinkedIn" }))
      .toHaveAttribute("href", "https://www.linkedin.com/in/vclementino")
    expect(screen.getByRole("link", { name: "GitHub" }))
      .toHaveAttribute("href", "https://github.com/vagnerclementino")
    expect(screen.getByRole("link", { name: "Twitter" }))
      .toHaveAttribute("href", "https://www.twitter.com/vclementino")
    expect(screen.getByRole("link", { name: "Email" }))
      .toHaveAttribute("href", "mailto:vagner.clementino@gmail.com")
    expect(screen.getByRole("link", { name: "Website" }))
      .toHaveAttribute("href", "https://clementino.me")
    expect(screen.getByRole("link", { name: "RSS" }))
      .toHaveAttribute("href", "/rss.xml")
  })

  it("opens external links in new tab", () => {
    render(<SocialLinks />)
    
    const externalLinks = [
      screen.getByRole("link", { name: "LinkedIn" }),
      screen.getByRole("link", { name: "GitHub" }),
      screen.getByRole("link", { name: "Twitter" }),
      screen.getByRole("link", { name: "Email" }),
      screen.getByRole("link", { name: "Website" }),
    ]
    
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute("target", "_blank")
      expect(link).toHaveAttribute("rel", "noopener noreferrer")
    })
  })

  it("RSS link opens in same tab", () => {
    render(<SocialLinks />)
    
    const rssLink = screen.getByRole("link", { name: "RSS" })
    expect(rssLink).toHaveAttribute("target", "_self")
    expect(rssLink).not.toHaveAttribute("rel")
  })
})
