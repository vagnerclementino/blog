import React from "react"
import { render, screen } from "@testing-library/react"
import BlogPostTemplate from "./blog-post"

jest.mock("gatsby", () => ({
  ...jest.requireActual("gatsby"),
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ children, to, ...rest }) => {
    const React = jest.requireActual('react');
    return React.createElement("a", { href: to, ...rest }, children);
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
  Disqus: () => null,
  componentWillMount: jest.fn()
}));

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon?.iconName || icon} {...props} />
  ),
}));

jest.mock("../components/scrollToTop", () => {
  return function MockScrollToTop() {
    return <div data-testid="scroll-to-top">Scroll to Top</div>
  }
});

jest.mock("../components/readingProgress", () => {
  return function MockReadingProgress() {
    return <div data-testid="reading-progress">Reading Progress</div>
  }
});

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
    
    //Check if title is rendered
    expect(getByText("Test Title")).toBeInTheDocument()
    
    //Check if date is rendered
    expect(getByText("January 1, 2023")).toBeInTheDocument()
    
    //Check if reading time is rendered
    expect(getByText(/Tempo de leitura:/)).toBeInTheDocument()
    
    //Check if body content is rendered
    expect(getByText("Test body content")).toBeInTheDocument()
  })

  it("renders navigation buttons with correct links and icons", () => {
    render(<BlogPostTemplate {...mockProps} />)
    
    //Check if Home button is rendered
    const homeButton = screen.getByText("Home").closest("a")
    expect(homeButton).toBeInTheDocument()
    expect(homeButton).toHaveAttribute("href", "/")
    
    //Check if Blog button is rendered
    const blogButton = screen.getByText("Todos os Posts").closest("a")
    expect(blogButton).toBeInTheDocument()
    expect(blogButton).toHaveAttribute("href", "/blog/")
    
    //Check if icons are rendered
    const icons = screen.getAllByTestId("font-awesome-icon")
    expect(icons).toHaveLength(2)
  })

  it("renders scroll to top component", () => {
    render(<BlogPostTemplate {...mockProps} />)
    
    expect(screen.getByTestId("scroll-to-top")).toBeInTheDocument()
  })

  it("renders reading progress component", () => {
    render(<BlogPostTemplate {...mockProps} />)
    
    expect(screen.getByTestId("reading-progress")).toBeInTheDocument()
  })
})
