import React from "react"
import { render } from "@testing-library/react"
import ReadingProgress from "./readingProgress"

describe("ReadingProgress", () => {
  it("renders without crashing", () => {
    render(<ReadingProgress />)
    
    // Verifica se o componente renderiza
    const progressContainer = document.querySelector('div')
    expect(progressContainer).toBeInTheDocument()
  })

  it("renders progress bar inside container", () => {
    render(<ReadingProgress />)
    
    const progressContainer = document.querySelector('div')
    const progressBar = document.querySelector('div > div')
    
    expect(progressContainer).toBeInTheDocument()
    expect(progressBar).toBeInTheDocument()
  })

  it("has proper DOM structure", () => {
    render(<ReadingProgress />)
    
    const containers = document.querySelectorAll('div')
    expect(containers.length).toBeGreaterThanOrEqual(2) // Container + progress bar
  })
})
