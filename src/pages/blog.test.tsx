import React from "react"
import { render, screen } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import Blog from "./blog"

import { useStaticQuery } from 'gatsby';

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon.iconName} {...props} />
  ),
}))

beforeEach(() => {
  HelmetProvider.canUseDOM = false;
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: "Clementino's Notes"
      },
    },
  });
});

jest.mock("../components/atoms/Bio", () => () => <div>Mock Bio</div>)
jest.mock("../components/molecules/SearchPosts", () => () => <div>Mock SearchPosts</div>)
jest.mock("../components/atoms/Button", () => ({ children }) => <button>{children}</button>)

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

const renderWithHelmet = (ui: React.ReactElement) => {
  const helmetContext: { helmet?: any } = {};
  const result = render(
    <HelmetProvider context={helmetContext}>{ui}</HelmetProvider>
  );
  return { ...result, helmetContext };
};

describe("Blog Page", () => {
  it("renders without errors", () => {
    const { container } = renderWithHelmet(<Blog {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it("renders Home link with Font Awesome icon", () => {
    renderWithHelmet(<Blog {...mockProps} />)
    
    const homeLink = screen.getByRole("link", { name: /Home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute("href", "/")
    
    const homeIcon = screen.getByTestId("font-awesome-icon")
    expect(homeIcon).toHaveAttribute("data-icon", "house")
  })

  it("renders all main components", () => {
    const { getByText } = renderWithHelmet(<Blog {...mockProps} />)
    
    expect(getByText("Mock Bio")).toBeInTheDocument()
    expect(getByText("Mock SearchPosts")).toBeInTheDocument()
    expect(getByText("Ir para o Website")).toBeInTheDocument()
  })

  it("includes SEO component with correct title", () => {
    const { helmetContext } = renderWithHelmet(<Blog {...mockProps} />)
    expect(helmetContext.helmet.title.toString()).toContain("All posts")
  })
})
