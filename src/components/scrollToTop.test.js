import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import ScrollToTop from "./scrollToTop"

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon?.iconName || icon} {...props} />
  ),
}))

// Mock window.scrollTo
const mockScrollTo = jest.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
})

describe("ScrollToTop", () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true
    })
  })

  it("renders the scroll to top button", () => {
    render(<ScrollToTop />)
    
    const button = screen.getByLabelText("Voltar ao topo da página")
    expect(button).toBeInTheDocument()
    expect(screen.getByTestId("font-awesome-icon")).toBeInTheDocument()
  })

  it("is initially hidden when page is at top", () => {
    render(<ScrollToTop />)
    
    const button = screen.getByLabelText("Voltar ao topo da página")
    expect(button).toHaveStyle("opacity: 0")
    expect(button).toHaveStyle("visibility: hidden")
  })

  it("becomes visible when scrolled down", () => {
    render(<ScrollToTop showOffset={200} />)
    
    // Simulate scroll down
    Object.defineProperty(window, 'pageYOffset', {
      value: 300,
      writable: true
    })
    
    fireEvent.scroll(window)
    
    const button = screen.getByLabelText("Voltar ao topo da página")
    expect(button).toHaveStyle("opacity: 1")
    expect(button).toHaveStyle("visibility: visible")
  })

  it("scrolls to top when clicked", () => {
    render(<ScrollToTop />)
    
    const button = screen.getByLabelText("Voltar ao topo da página")
    fireEvent.click(button)
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    })
  })

  it("uses custom showOffset prop", () => {
    render(<ScrollToTop showOffset={500} />)
    
    // Scroll less than offset
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      writable: true
    })
    
    fireEvent.scroll(window)
    
    const button = screen.getByLabelText("Voltar ao topo da página")
    expect(button).toHaveStyle("opacity: 0")
    
    // Scroll more than offset
    Object.defineProperty(window, 'pageYOffset', {
      value: 600,
      writable: true
    })
    
    fireEvent.scroll(window)
    
    expect(button).toHaveStyle("opacity: 1")
  })
})
