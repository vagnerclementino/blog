import React from "react"
import { render } from "@testing-library/react"
import { HelmetProvider } from 'react-helmet-async';
import { useStaticQuery } from 'gatsby';
import NotFoundPage from "./404"

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
  HelmetProvider.canUseDOM = false;
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

const renderWithHelmet = (ui: React.ReactElement) => {
  const helmetContext: { helmet?: any } = {};
  const result = render(
    <HelmetProvider context={helmetContext}>{ui}</HelmetProvider>
  );
  return { ...result, helmetContext };
};

describe("404 Page", () => {
  it("renders without errors", () => {
    const { container } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  it("displays the friendly error message", () => {
    const { getByText } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(getByText(/Parece que você tentou ler um rascunho/i)).toBeInTheDocument()
  })

  it("displays navigation links", () => {
    const { getByText } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(getByText(/Voltar para o Início/)).toBeInTheDocument()
    expect(getByText(/Tentar pesquisar/)).toBeInTheDocument()
  })

  it("renders the histogram panel", () => {
    const { container } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(container.querySelector("pre")).toBeInTheDocument()
  })

  it("renders the documents table", () => {
    const { getByText } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(getByText("Documents")).toBeInTheDocument()
  })

  it("includes SEO component with correct title", () => {
    const { helmetContext } = renderWithHelmet(<NotFoundPage {...mockProps} />)
    expect(helmetContext.helmet.title.toString()).toContain('404: Not Found')
  })
})
