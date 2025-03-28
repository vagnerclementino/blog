import React from "react"
import { render } from "@testing-library/react"
import { Helmet } from "react-helmet"
import Blog from "./blog"

import { useStaticQuery } from 'gatsby';


beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: "Clementino's Notes"
      },
    },
  });
});

// Mock child components
jest.mock("../components/bio", () => () => <div>Mock Bio</div>)
jest.mock("../components/searchPosts", () => () => <div>Mock SearchPosts</div>)
jest.mock("../components/button", () => () => <button>Mock Button</button>)

const mockProps = {
  data: {
    site: {
      siteMetadata: {
        title: "Clementino's Notes"
      }
    },
    localSearchBlog: {
      index: "test-index",
      store: JSON.stringify({
        "post": {
          "title": "Test Post 1",
          "date": "2025-03-10",
          "description": "Description for Test Post 1",
          "excerpt": "Excerpt for Test Post 1"
        }
      })
    },
    allMdx: {
      edges: [
        {
          node: {
            excerpt: "Test excerpt",
            fields: {
              slug: "/test-post",
              released: true,
              releasedNotForced: true
            },
            frontmatter: {
              date: "January 01, 2023",
              title: "Test Post",
              description: "Test Description"
            }
          }
        }
      ]
    }
  },
  location: {
    pathname: "/blog"
  },
  navigate: jest.fn()
}

beforeEach(() => {
  process.env.HOMEPAGE_URL = "https://test-site.com"
})

describe("Blog Page", () => {
  it("renders without errors", () => {
    const { container } = render(<Blog {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it("renders all main components", () => {
    const { getByText } = render(<Blog {...mockProps} />)
    
    expect(getByText("Mock Bio")).toBeInTheDocument()
    expect(getByText("Mock SearchPosts")).toBeInTheDocument()
    expect(getByText("Mock Button")).toBeInTheDocument()
  })

  it("includes SEO component with correct title", () => {
    render(<Blog {...mockProps} />)
    const helmet = Helmet.peek()
    expect(helmet.title).toBe("All posts | Clementino's Notes")
  })
})
