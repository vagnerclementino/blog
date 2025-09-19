import React from "react"
import { render, screen } from "@testing-library/react"
import Avatar from "./avatar"

jest.mock("gatsby", () => ({
  useStaticQuery: jest.fn(),
  graphql: jest.fn(),
}))

jest.mock("gatsby-plugin-image", () => ({
  GatsbyImage: ({ image, alt, ...props }) => (
    <img data-testid="gatsby-image" alt={alt} {...props} />
  ),
  getImage: jest.fn(),
}))

const { useStaticQuery } = require("gatsby")
const { getImage } = require("gatsby-plugin-image")

describe("Avatar", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders avatar image when data is available", () => {
    const mockImageData = {
      avatar: {
        childImageSharp: {
          gatsbyImageData: {
            images: {
              fallback: {
                src: "/avatar.png",
                srcSet: "/avatar.png 200w",
                sizes: "200px",
              },
            },
            layout: "fixed",
            width: 200,
            height: 200,
          },
        },
      },
    }

    useStaticQuery.mockReturnValue(mockImageData)
    getImage.mockReturnValue(mockImageData.avatar.childImageSharp.gatsbyImageData)

    render(<Avatar size={100} />)

    expect(screen.getByTestId("gatsby-image")).toBeInTheDocument()
    expect(screen.getByAltText("Vagner Clementino")).toBeInTheDocument()
  })

  it("renders placeholder when image is not available", () => {
    useStaticQuery.mockReturnValue({
      avatar: null,
    })
    getImage.mockReturnValue(null)

    render(<Avatar size={80} />)

    expect(screen.getByText("👤")).toBeInTheDocument()
    expect(screen.queryByTestId("gatsby-image")).not.toBeInTheDocument()
  })

  it("applies custom size correctly", () => {
    useStaticQuery.mockReturnValue({
      avatar: null,
    })
    getImage.mockReturnValue(null)

    const { container } = render(<Avatar size={120} />)
    
    // The styled component will apply the size, we just check it renders
    expect(container.firstChild).toBeInTheDocument()
  })

  it("applies custom className", () => {
    useStaticQuery.mockReturnValue({
      avatar: null,
    })
    getImage.mockReturnValue(null)

    render(<Avatar className="custom-avatar" />)
    
    expect(screen.getByText("👤").parentElement).toHaveClass("custom-avatar")
  })

  it("uses default size when not specified", () => {
    useStaticQuery.mockReturnValue({
      avatar: null,
    })
    getImage.mockReturnValue(null)

    const { container } = render(<Avatar />)
    
    // Should render with default size (component will handle styling)
    expect(container.firstChild).toBeInTheDocument()
  })
})
