import React from "react"
import { render } from "@testing-library/react"
import BlogPostTemplate from "../blog-post"

// Mock the gatsby imports
jest.mock("gatsby", () => ({
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
      children,
      ...rest
    }) => React.createElement("a", rest, children)
  ),
}))

describe("BlogPostTemplate", () => {
  const mockProps = {
    data: {
      mdx: {
        id: "test-id",
        excerpt: "Test excerpt",
        body: "Test body content",
        frontmatter: {
          title: "Test Title",
          date: "January 1, 2023",
          description: "Test description",
        },
        fields: {
          readingTime: {
            text: "5 min read",
            minutes: 5,
          },
        },
      },
    },
    pageContext: {
      previous: null,
      next: null,
    },
    location: {
      pathname: "/test-path",
      host: "test.com",
    },
  }

  it("renders the blog post content correctly", () => {
    const { getByText } = render(<BlogPostTemplate {...mockProps} />)
    
    // Check if title is rendered
    expect(getByText("Test Title")).toBeInTheDocument()
    
    // Check if date is rendered
    expect(getByText("January 1, 2023")).toBeInTheDocument()
    
    // Check if reading time is rendered
    expect(getByText(/Tempo de leitura:/)).toBeInTheDocument()
    
    // Check if body content is rendered
    expect(getByText("Test body content")).toBeInTheDocument()
  })
})