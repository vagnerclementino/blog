import React from "react"
import { render } from "@testing-library/react"
import ReadingProgress from "./readingProgress"

describe("ReadingProgress", () => {
  it("renders reading progress component with container element", () => {
    const { container } = render(<ReadingProgress />)

    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild.tagName).toBe('DIV')
  })

  it("renders progress bar inside container", () => {
    const { container } = render(<ReadingProgress />)
    
    const progressContainer = container.firstChild
    const progressBar = progressContainer?.firstChild
    
    expect(progressContainer).toBeInTheDocument()
    expect(progressBar).toBeInTheDocument()
  })

  it("renders container and progress bar elements in DOM structure", () => {
    render(<ReadingProgress />)
    
    const containers = document.querySelectorAll('div')
    expect(containers.length).toBeGreaterThanOrEqual(2)
  })
})
