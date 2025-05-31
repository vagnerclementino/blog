import React from "react"
import { render } from "@testing-library/react"
import BlogPostTemplate from "./blog-post"

// Mock the gatsby imports
jest.mock("gatsby", () => ({
  ...jest.requireActual("gatsby"),
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ children, ...rest }) => {
    const React = jest.requireActual('react');
    return React.createElement("a", rest, children);
  }),
  useStaticQuery: jest.fn().mockReturnValue({
    site: {
      siteMetadata: {
        title: "Test Site",
        author: "Test Author",
        social: {
          twitter: "testuser",
        },
      },
    },
  }),
}));

jest.mock("gatsby-plugin-disqus", () => ({
  Disqus: jest.fn().mockImplementation(() => null)
}));

jest.mock("gatsby-plugin-image", () => ({
  GatsbyImage: jest.fn().mockImplementation(({ alt }) => {
    const React = jest.requireActual('react');
    return React.createElement("img", { alt });
  }),
  getImage: jest.fn().mockReturnValue({
    images: {
      fallback: {
        src: "test-image.jpg",
      },
    },
  }),
}));

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
          featuredImage: {
            childImageSharp: {
              gatsbyImageData: {},
            },
          },
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
    children: <p>Test body content</p>
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
