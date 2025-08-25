import React from "react"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import NewsletterSignup from "./newsletterSignup"

describe("NewsletterSignup", () => {
  it("renders newsletter signup form", () => {
    render(<NewsletterSignup />)
    
    expect(screen.getByText("📬 Newsletter")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Inscrever-se" })).toBeInTheDocument()
    expect(screen.getByText(/Receba as últimas atualizações/)).toBeInTheDocument()
  })

  it("shows success message when valid email is submitted", async () => {
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText("seu@email.com")
    const submitButton = screen.getByRole("button", { name: "Inscrever-se" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("✅ Obrigado! Você foi inscrito com sucesso.")).toBeInTheDocument()
    })
    
    // Email input should be cleared
    expect(emailInput.value).toBe("")
  })

  it("shows error message when empty email is submitted", async () => {
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText("seu@email.com")
    const submitButton = screen.getByRole("button", { name: "Inscrever-se" })
    
    // Remove the required attribute to test our custom validation
    emailInput.removeAttribute('required')
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("❌ Por favor, insira um email válido.")).toBeInTheDocument()
    })
  })

  it("clears status message after 3 seconds", async () => {
    jest.useFakeTimers()
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByPlaceholderText("seu@email.com")
    const submitButton = screen.getByRole("button", { name: "Inscrever-se" })
    
    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("✅ Obrigado! Você foi inscrito com sucesso.")).toBeInTheDocument()
    })
    
    // Fast forward 3 seconds with act
    await act(async () => {
      jest.advanceTimersByTime(3000)
    })
    
    await waitFor(() => {
      expect(screen.queryByText("✅ Obrigado! Você foi inscrito com sucesso.")).not.toBeInTheDocument()
    })
    
    jest.useRealTimers()
  })

  it("displays disclaimer about demo functionality", () => {
    render(<NewsletterSignup />)
    
    expect(screen.getByText(/Esta é uma funcionalidade demonstrativa/)).toBeInTheDocument()
  })
})
