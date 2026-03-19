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

  it("displays the friendly error message", () => {
    const { getByText } = render(<NotFoundPage {...mockProps} />)
    expect(getByText(/Parece que você tentou ler um rascunho/i)).toBeInTheDocument()
  })

  it("displays navigation links", () => {
    const { getByText } = render(<NotFoundPage {...mockProps} />)
    expect(getByText(/Voltar para o Início/)).toBeInTheDocument()
    expect(getByText(/Tentar pesquisar/)).toBeInTheDocument()
  })

  it("renders the histogram panel", () => {
    const { container } = render(<NotFoundPage {...mockProps} />)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })

  it("renders the documents table", () => {
    const { getByText } = render(<NotFoundPage {...mockProps} />)
    expect(getByText("Documents")).toBeInTheDocument()
  })

  it("includes SEO component with correct title", () => {
    render(<NotFoundPage {...mockProps} />)
    const helmet = Helmet.peek();
    expect(helmet.title).toBe('404: Not Found | Test Site Title')
  })
})
