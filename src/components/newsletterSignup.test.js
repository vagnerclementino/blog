import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import NewsletterSignup from "./newsletterSignup"

//Mock mailcheck
jest.mock("mailcheck", () => ({
  run: jest.fn(),
}))

import Mailcheck from "mailcheck"

//Set up the Firebase Function URL env var
process.env.GATSBY_NEWSLETTER_FUNCTION_URL =
  "https://test-function.example.com/subscribeToNewsletter"

//Mock global fetch
global.fetch = jest.fn()

describe("NewsletterSignup", () => {
  beforeEach(() => {
    //Default: mailcheck finds no suggestion
    Mailcheck.run.mockImplementation(({ empty }) => empty && empty())
    fetch.mockClear()
    Mailcheck.run.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the newsletter form correctly", () => {
    render(<NewsletterSignup />)
    expect(screen.getByText("📬 Newsletter")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Inscrever-se" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Receba as últimas atualizações/)
    ).toBeInTheDocument()
  })

  it("shows a mailcheck suggestion when domain has a typo", async () => {
    Mailcheck.run.mockImplementation(({ suggested }) =>
      suggested({ full: "user@gmail.com", domain: "gmail.com" })
    )

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmial.com" },
    })

    await waitFor(() => {
      expect(screen.getByText("user@gmail.com")).toBeInTheDocument()
      expect(screen.getByText(/Você quis dizer/)).toBeInTheDocument()
    })
  })

  it("applies the mailcheck suggestion when the user clicks it", async () => {
    Mailcheck.run.mockImplementation(({ suggested }) =>
      suggested({ full: "user@gmail.com", domain: "gmail.com" })
    )

    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText("seu@email.com")

    fireEvent.change(input, { target: { value: "user@gmial.com" } })

    await waitFor(() => {
      expect(screen.getByText("user@gmail.com")).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText("user@gmail.com"))

    expect(input.value).toBe("user@gmail.com")
    expect(screen.queryByText(/Você quis dizer/)).not.toBeInTheDocument()
  })

  it("hides the suggestion when no typo is detected", () => {
    Mailcheck.run.mockImplementation(({ empty }) => empty && empty())

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })

    expect(screen.queryByText(/Você quis dizer/)).not.toBeInTheDocument()
  })

  it("shows error for invalid email format without making an API call", async () => {
    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText("seu@email.com")
    input.removeAttribute("required")

    fireEvent.change(input, { target: { value: "invalid-email" } })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Por favor, insira um email válido/)
      ).toBeInTheDocument()
    })

    expect(fetch).not.toHaveBeenCalled()
  })

  it("shows loading state while waiting for API response", async () => {
    fetch.mockImplementation(() => new Promise(() => {}))

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(screen.getByText("Enviando...")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled()
    })
  })

  it("shows success message and clears input on successful subscription", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        message:
          "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
      }),
    })

    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText("seu@email.com")

    fireEvent.change(input, { target: { value: "user@gmail.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(
        screen.getByText(/verifique sua caixa de entrada/)
      ).toBeInTheDocument()
    })

    expect(input.value).toBe("")
  })

  it("calls the Firebase Function with POST and JSON body", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: "OK" }),
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://test-function.example.com/subscribeToNewsletter",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@gmail.com" }),
        })
      )
    })
  })

  it("shows server error message when API returns error", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: jest
        .fn()
        .mockResolvedValue({ error: "Este e-mail já está inscrito!" }),
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Este e-mail já está inscrito/)
      ).toBeInTheDocument()
    })
  })

  it("shows connection error message on network failure", async () => {
    fetch.mockRejectedValue(new Error("Network error"))

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(screen.getByText(/Erro de conexão/)).toBeInTheDocument()
    })
  })

  it("shows error for disposable email rejected by server", async () => {
    fetch.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error:
          "E-mails temporários não são permitidos. Use seu e-mail principal.",
      }),
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@mailinator.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }))

    await waitFor(() => {
      expect(
        screen.getByText(/E-mails temporários não são permitidos/)
      ).toBeInTheDocument()
    })
  })
})
