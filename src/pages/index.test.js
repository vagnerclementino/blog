import React from "react"
import { render, screen } from "@testing-library/react"
import IndexPage from "./index"

//Mock dos componentes
jest.mock("../components/wideLayout", () => ({ children, title }) => (
  <div data-testid="layout" data-title={title}>
    {children}
  </div>
))

jest.mock("../components/seo", () => ({ title, keywords }) => (
  <div data-testid="seo" data-title={title} data-keywords={keywords?.join(",")} />
))

jest.mock("../components/button", () => ({ children, marginTop }) => (
  <button data-margin-top={marginTop}>{children}</button>
))

jest.mock("../components/postCard", () => ({ post }) => (
  <div data-testid="post-card" data-slug={post.fields.slug}>
    {post.frontmatter.title}
  </div>
))

jest.mock("../components/postCarousel", () => ({ posts, title, featured, count }) => (
  <div 
    data-testid={featured ? "featured-posts" : "recent-posts"} 
    data-posts-count={posts.length}
    data-title={title}
    data-count={count}
  >
    {title} Component
  </div>
))

jest.mock("../components/socialLinks", () => () => (
  <div data-testid="social-links">Social Links Component</div>
))

jest.mock("../components/avatar", () => ({ size }) => (
  <div data-testid="avatar" data-size={size}>Avatar Component</div>
))

//Mock do Gatsby
jest.mock("gatsby", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  graphql: jest.fn(),
}))

const mockData = {
  site: {
    siteMetadata: {
      title: "Clementino's Notes",
    },
  },
  allMdx: {
    edges: [
      {
        node: {
          fields: { slug: "/post-1/" },
          frontmatter: {
            title: "Post 1",
            date: "01/01/2024",
            description: "Description 1",
          },
          excerpt: "Excerpt 1",
        },
      },
      {
        node: {
          fields: { slug: "/post-2/" },
          frontmatter: {
            title: "Post 2",
            date: "02/01/2024", 
            description: "Description 2",
          },
          excerpt: "Excerpt 2",
        },
      },
      {
        node: {
          fields: { slug: "/post-3/" },
          frontmatter: {
            title: "Post 3",
            date: "03/01/2024",
            description: "Description 3",
          },
          excerpt: "Excerpt 3",
        },
      },
    ],
  },
}

const mockProps = {
  data: mockData,
  location: { pathname: "/" },
}

describe("IndexPage", () => {
  it("renders the homepage with all main sections", () => {
    render(<IndexPage {...mockProps} />)
    
    //Avatar
    expect(screen.getByTestId("avatar")).toBeInTheDocument()
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "120")
    
    //Hero section (without welcome title)
    expect(screen.getByText(/Sou/)).toBeInTheDocument()
    expect(screen.getByText(/Vagner Clementino/)).toBeInTheDocument()
    
    //Featured posts
    expect(screen.getByTestId("featured-posts")).toBeInTheDocument()
    expect(screen.getByTestId("featured-posts")).toHaveAttribute("data-title", "Posts em Destaque")
    
    //Recent posts
    expect(screen.getByTestId("recent-posts")).toBeInTheDocument()
    expect(screen.getByTestId("recent-posts")).toHaveAttribute("data-title", "Últimos Posts")
    expect(screen.getByTestId("recent-posts")).toHaveAttribute("data-count", "5")
    
    //Social links and newsletter
    expect(screen.getByTestId("social-links")).toBeInTheDocument()
  })

  it("renders PostCarousel components with correct props", () => {
    render(<IndexPage {...mockProps} />)
    
    const featuredPosts = screen.getByTestId("featured-posts")
    expect(featuredPosts).toHaveAttribute("data-posts-count", "3")
    expect(featuredPosts).toHaveAttribute("data-title", "Posts em Destaque")
    
    const recentPosts = screen.getByTestId("recent-posts")
    expect(recentPosts).toHaveAttribute("data-posts-count", "3")
    expect(recentPosts).toHaveAttribute("data-count", "5")
  })

  it("has navigation links to blog and portfolio", () => {
    render(<IndexPage {...mockProps} />)
    
    const blogLinks = screen.getAllByRole("link", { name: /Ver todos os posts/ })
    expect(blogLinks.length).toBeGreaterThan(0)
    
    const portfolioLink = screen.getByRole("link", { name: "Conheça meu portfólio →" })
    expect(portfolioLink).toHaveAttribute("href", "https://clementino.me")
    expect(portfolioLink).toHaveAttribute("target", "_blank")
  })

  it("passes correct data to PostCarousel components", () => {
    render(<IndexPage {...mockProps} />)
    
    const featuredPosts = screen.getByTestId("featured-posts")
    expect(featuredPosts).toHaveAttribute("data-posts-count", "3")
    expect(featuredPosts).toHaveAttribute("data-title", "Posts em Destaque")
    
    const recentPosts = screen.getByTestId("recent-posts")
    expect(recentPosts).toHaveAttribute("data-posts-count", "3")
    expect(recentPosts).toHaveAttribute("data-count", "5")
  })

  it("renders SEO component with correct props", () => {
    render(<IndexPage {...mockProps} />)
    
    const seo = screen.getByTestId("seo")
    expect(seo).toHaveAttribute("data-title", "Home")
    expect(seo.getAttribute("data-keywords")).toContain("blog")
    expect(seo.getAttribute("data-keywords")).toContain("desenvolvimento")
  })

  it("renders layout with correct title", () => {
    render(<IndexPage {...mockProps} />)
    
    const layout = screen.getByTestId("layout")
    expect(layout).toHaveAttribute("data-title", "Clementino's Notes")
  })

  it("renders avatar with correct size", () => {
    render(<IndexPage {...mockProps} />)
    
    const avatar = screen.getByTestId("avatar")
    expect(avatar).toHaveAttribute("data-size", "120")
  })
})
