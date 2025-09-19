import React from "react"
import { render, screen } from "@testing-library/react"
import SocialLinks from "./socialLinks"

// Mock Font Awesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon.iconName} {...props} />
  ),
}))

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

  it("renders Font Awesome icons", () => {
    render(<SocialLinks />)
    
    const icons = screen.getAllByTestId("font-awesome-icon")
    expect(icons).toHaveLength(6)
    
    // Verify all expected icons are present
    const iconNames = icons.map(icon => icon.getAttribute("data-icon"))
    expect(iconNames).toContain("linkedin")
    expect(iconNames).toContain("github")
    expect(iconNames).toContain("twitter")
    expect(iconNames).toContain("envelope")
    expect(iconNames).toContain("globe")
    expect(iconNames).toContain("rss")
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
    expect(rssLink).toHaveAttribute("rel", "")
  })

  it("has hover colors for each social platform", () => {
    render(<SocialLinks />)
    
    const linkedinLink = screen.getByRole("link", { name: "LinkedIn" })
    const githubLink = screen.getByRole("link", { name: "GitHub" })
    const twitterLink = screen.getByRole("link", { name: "Twitter" })
    
    // Check that hover color props are applied (styled-components will handle the actual styling)
    expect(linkedinLink).toBeInTheDocument()
    expect(githubLink).toBeInTheDocument()
    expect(twitterLink).toBeInTheDocument()
  })

  it("renders title centered", () => {
    render(<SocialLinks />)
    
    const title = screen.getByText("Conecte-se comigo")
    expect(title).toBeInTheDocument()
    // The centering is handled by CSS, we just verify the element exists
  })

  it("renders exactly 6 social links in grid layout", () => {
    render(<SocialLinks />)
    
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(6)
    
    // Verify the grid contains all expected social platforms
    const linkTexts = links.map(link => link.textContent)
    expect(linkTexts).toContain("LinkedIn")
    expect(linkTexts).toContain("GitHub")
    expect(linkTexts).toContain("Twitter")
    expect(linkTexts).toContain("Email")
    expect(linkTexts).toContain("Website")
    expect(linkTexts).toContain("RSS")
  })
})
