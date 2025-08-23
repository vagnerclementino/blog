import React from "react"
import { render, screen } from "@testing-library/react"
import PostCard from "./postCard"

// Mock do Gatsby Link
jest.mock("gatsby", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

const mockPost = {
  fields: {
    slug: "/test-post/",
  },
  frontmatter: {
    title: "Test Post Title",
    date: "01/01/2024",
    description: "This is a test post description",
  },
  excerpt: "This is a test excerpt",
}

describe("PostCard", () => {
  it("renders post card with title, date, and description", () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText("Test Post Title")).toBeInTheDocument()
    expect(screen.getByText("01/01/2024")).toBeInTheDocument()
    expect(screen.getByText("This is a test post description")).toBeInTheDocument()
    expect(screen.getByText("Ler mais →")).toBeInTheDocument()
  })

  it("uses excerpt when description is not available", () => {
    const postWithoutDescription = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        description: null,
      },
    }
    
    render(<PostCard post={postWithoutDescription} />)
    
    expect(screen.getByText("This is a test excerpt")).toBeInTheDocument()
  })

  it("uses slug as title when title is not available", () => {
    const postWithoutTitle = {
      ...mockPost,
      frontmatter: {
        ...mockPost.frontmatter,
        title: null,
      },
    }
    
    render(<PostCard post={postWithoutTitle} />)
    
    expect(screen.getByText("/test-post/")).toBeInTheDocument()
  })

  it("has correct links to the post", () => {
    render(<PostCard post={mockPost} />)
    
    const titleLink = screen.getByRole("link", { name: "Test Post Title" })
    const readMoreLink = screen.getByRole("link", { name: "Ler mais →" })
    
    expect(titleLink).toHaveAttribute("href", "/test-post/")
    expect(readMoreLink).toHaveAttribute("href", "/test-post/")
  })
})
