import React from "react"
import { render } from "@testing-library/react"
import { useStaticQuery } from 'gatsby';
import NotFoundPage from "./404"
import { Helmet } from 'react-helmet'; 

const mockProps = {
  data: {
    site: {
      siteMetadata: {
        title: "Clementino's Notes"
      }
    }
  },
  location: {
    pathname: "/404"
  }
}

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: 'Test Site Title',
        description: 'Test Site Description',
        author: 'Test Author',
        siteUrl: 'https://testsite.com',
      },
    },
  });
});

describe("404 Page", () => {
  it("renders without errors", () => {
    const { container } = render(<NotFoundPage {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it("displays the correct title and message", () => {
    const { getByText } = render(<NotFoundPage {...mockProps} />)
    
    expect(getByText("Not Found")).toBeInTheDocument()
    expect(
      getByText(/You just hit a route that doesn't exist... the sadness./i)
    ).toBeInTheDocument()
  })

  it("includes SEO component with correct title", () => {
    render(<NotFoundPage {...mockProps} />)
    const helmet = Helmet.peek();
    expect(helmet.title).toBe('404: Not Found | Test Site Title')
  })
})
