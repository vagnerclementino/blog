import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import NewsletterSignup from "./newsletterSignup"

jest.mock("mailcheck", () => ({
  run: jest.fn(),
}))

import Mailcheck from "mailcheck"

const mockCallable = jest.fn()
jest.mock("../firebase", () => ({
  app: {},
  appCheck: null,
  functions: {},
}))

jest.mock("firebase/functions", () => ({
  getFunctions: jest.fn(() => ({})),
  httpsCallable: jest.fn(() => mockCallable),
  connectFunctionsEmulator: jest.fn(),
}))

describe("NewsletterSignup", () => {
  beforeEach(() => {
    Mailcheck.run.mockImplementation(({ empty }) => empty && empty())
    mockCallable.mockClear()
    Mailcheck.run.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the newsletter form correctly", () => {
    render(<NewsletterSignup />)
    expect(screen.getByText(/Newsletter/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Enviar" })
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
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Por favor, insira um email válido/)
      ).toBeInTheDocument()
    })

    expect(mockCallable).not.toHaveBeenCalled()
  })

  it("shows loading state while waiting for API response", async () => {
    mockCallable.mockImplementation(() => new Promise(() => {}))

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(screen.getByText("Enviando...")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Enviando..." })).toBeDisabled()
    })
  })

  it("shows success message and clears input on successful subscription", async () => {
    mockCallable.mockResolvedValue({
      data: {
        message: "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
      },
    })

    render(<NewsletterSignup />)
    const input = screen.getByPlaceholderText("seu@email.com")

    fireEvent.change(input, { target: { value: "user@gmail.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(
        screen.getByText(/verifique sua caixa de entrada/)
      ).toBeInTheDocument()
    })

    expect(input.value).toBe("")
  })

  it("calls httpsCallable with the email", async () => {
    mockCallable.mockResolvedValue({
      data: { message: "OK" },
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(mockCallable).toHaveBeenCalledWith({ email: "user@gmail.com" })
    })
  })

  it("shows server error message when API returns error", async () => {
    mockCallable.mockResolvedValue({
      data: { error: "Este e-mail já está inscrito!" },
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(
        screen.getByText(/Este e-mail já está inscrito/)
      ).toBeInTheDocument()
    })
  })

  it("shows connection error message on network failure", async () => {
    mockCallable.mockRejectedValue(new Error("Network error"))

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(screen.getByText(/Erro de conexão/)).toBeInTheDocument()
    })
  })

  it("shows error for disposable email rejected by server", async () => {
    mockCallable.mockResolvedValue({
      data: {
        error: "E-mails temporários não são permitidos. Use seu e-mail principal.",
      },
    })

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@mailinator.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(
        screen.getByText(/E-mails temporários não são permitidos/)
      ).toBeInTheDocument()
    })
  })

  it("shows authentication error for UNAUTHENTICATED response", async () => {
    mockCallable.mockRejectedValue(new Error("UNAUTHENTICATED"))

    render(<NewsletterSignup />)
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@gmail.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

    await waitFor(() => {
      expect(screen.getByText(/Erro de autenticação/)).toBeInTheDocument()
    })
  })
})
