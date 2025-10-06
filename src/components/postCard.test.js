import React from "react"
import { render, screen } from "@testing-library/react"
import PostCard from "./postCard"

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

const mockPostWithLongContent = {
  fields: { slug: "/long-post/" },
  frontmatter: {
    title: "This is a Very Long Post Title That Should Be Truncated After Two Lines to Maintain Consistent Card Heights",
    date: "02/01/2024",
    description: "This is a very long description that should be truncated after four lines to ensure all cards have the same height regardless of content length. This text is intentionally long to test the truncation functionality and ensure consistent card layouts across different content lengths."
  },
  excerpt: "Long excerpt content"
}

const mockPostWithShortContent = {
  fields: { slug: "/short-post/" },
  frontmatter: {
    title: "Short",
    date: "03/01/2024",
    description: "Short desc."
  },
  excerpt: "Short."
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

  it("displays standardized 'Ler mais' text", () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText("Ler mais →")).toBeInTheDocument()
  })

  it("has fixed height for uniform card sizes", () => {
    const { container: container1 } = render(<PostCard post={mockPostWithLongContent} />)
    const { container: container2 } = render(<PostCard post={mockPostWithShortContent} />)
    
    const card1 = container1.querySelector('article')
    const card2 = container2.querySelector('article')
    
    //Both cards should have the same fixed height
    expect(card1).toHaveStyle('height: 320px')
    expect(card2).toHaveStyle('height: 320px')
  })

  it("truncates long titles and descriptions with CSS", () => {
    render(<PostCard post={mockPostWithLongContent} />)
    
    //Title should be present but truncated via CSS
    expect(screen.getByText(/This is a Very Long Post Title/)).toBeInTheDocument()
    
    //Description should be present but truncated via CSS
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument()
  })

  it("maintains consistent layout structure", () => {
    const { container } = render(<PostCard post={mockPost} />)
    
    const card = container.querySelector('article')
    const cardContent = card.querySelector('div')
    
    expect(card).toHaveStyle('display: flex')
    expect(card).toHaveStyle('flex-direction: column')
    expect(cardContent).toHaveStyle('display: flex')
    expect(cardContent).toHaveStyle('flex-direction: column')
    expect(cardContent).toHaveStyle('height: 100%')
  })
})
