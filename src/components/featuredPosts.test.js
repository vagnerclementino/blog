import React from "react"
import { render, screen } from "@testing-library/react"
import FeaturedPosts from "./featuredPosts"

// Mock do Gatsby Link
jest.mock("gatsby", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

const mockPosts = [
  {
    node: {
      fields: { slug: "/post-1/" },
      frontmatter: {
        title: "Featured Post 1",
        date: "01/01/2024",
        description: "Description for post 1",
      },
      excerpt: "Excerpt for post 1",
    },
  },
  {
    node: {
      fields: { slug: "/post-2/" },
      frontmatter: {
        title: "Featured Post 2", 
        date: "02/01/2024",
        description: "Description for post 2",
      },
      excerpt: "Excerpt for post 2",
    },
  },
  {
    node: {
      fields: { slug: "/post-3/" },
      frontmatter: {
        title: "Featured Post 3",
        date: "03/01/2024", 
        description: "Description for post 3",
      },
      excerpt: "Excerpt for post 3",
    },
  },
  {
    node: {
      fields: { slug: "/post-4/" },
      frontmatter: {
        title: "Regular Post 4",
        date: "04/01/2024",
        description: "Description for post 4",
      },
      excerpt: "Excerpt for post 4",
    },
  },
]

describe("FeaturedPosts", () => {
  it("renders featured posts section with title", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getByText("⭐ Posts em Destaque")).toBeInTheDocument()
  })

  it("displays only first 3 posts as featured", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 2")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 3")).toBeInTheDocument()
    expect(screen.queryByText("Regular Post 4")).not.toBeInTheDocument()
  })

  it("shows featured badge on each post", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    const badges = screen.getAllByText("Destaque")
    expect(badges).toHaveLength(3)
  })

  it("renders post details correctly", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getByText("01/01/2024")).toBeInTheDocument()
    expect(screen.getByText("Description for post 1")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Featured Post 1" }))
      .toHaveAttribute("href", "/post-1/")
  })

  it("renders nothing when no posts provided", () => {
    const { container } = render(<FeaturedPosts posts={[]} />)
    
    expect(container.firstChild).toBeNull()
  })

  it("handles posts without description by using excerpt", () => {
    const postsWithoutDescription = [
      {
        node: {
          fields: { slug: "/post-1/" },
          frontmatter: {
            title: "Post without description",
            date: "01/01/2024",
            description: null,
          },
          excerpt: "This is the excerpt",
        },
      },
    ]
    
    render(<FeaturedPosts posts={postsWithoutDescription} />)
    
    expect(screen.getByText("This is the excerpt")).toBeInTheDocument()
  })

  it("has read more links for each featured post", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    const readMoreLinks = screen.getAllByText("Ler post completo →")
    expect(readMoreLinks).toHaveLength(3)
    
    expect(readMoreLinks[0]).toHaveAttribute("href", "/post-1/")
    expect(readMoreLinks[1]).toHaveAttribute("href", "/post-2/")
    expect(readMoreLinks[2]).toHaveAttribute("href", "/post-3/")
  })
})
