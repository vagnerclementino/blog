// Mocks must be declared before imports (Jest hoists jest.mock calls)
jest.mock("firebase-functions/v2/https", () => ({
  onRequest: (_options: unknown, handler: unknown) => handler,
}))

jest.mock("firebase-functions/logger", () => ({
  error: jest.fn(),
  info: jest.fn(),
}))

import { isValidEmail, isDisposableEmail, subscribeToNewsletter } from "./index"

// Type helper: after mocking onRequest, subscribeToNewsletter is the bare handler
type Handler = (req: unknown, res: unknown) => Promise<void>
const handler = (subscribeToNewsletter as unknown) as Handler

// ─── isValidEmail ─────────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true)
    expect(isValidEmail("user.name+tag@sub.domain.co.uk")).toBe(true)
    expect(isValidEmail("a@b.io")).toBe(true)
  })

  it("returns false for emails missing @", () => {
    expect(isValidEmail("notanemail")).toBe(false)
  })

  it("returns false for emails missing domain extension", () => {
    expect(isValidEmail("user@nodomain")).toBe(false)
  })

  it("returns false for emails with no local part", () => {
    expect(isValidEmail("@example.com")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isValidEmail("")).toBe(false)
  })

  it("returns false for emails with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false)
  })
})

// ─── isDisposableEmail ────────────────────────────────────────────────────────

describe("isDisposableEmail", () => {
  it("returns true for known disposable domains", () => {
    // These domains are in the real disposable-email-domains package
    expect(isDisposableEmail("user@10minutemail.com")).toBe(true)
    expect(isDisposableEmail("user@mailinator.com")).toBe(true)
    expect(isDisposableEmail("user@guerrillamail.com")).toBe(true)
    expect(isDisposableEmail("user@temp-mail.com")).toBe(true)
  })

  it("returns false for legitimate email domains", () => {
    expect(isDisposableEmail("user@gmail.com")).toBe(false)
    expect(isDisposableEmail("user@outlook.com")).toBe(false)
    expect(isDisposableEmail("user@example.com")).toBe(false)
    expect(isDisposableEmail("user@company.com")).toBe(false)
  })

  it("returns false when email has no domain", () => {
    expect(isDisposableEmail("nodomain")).toBe(false)
  })
})

// ─── subscribeToNewsletter (HTTP handler) ─────────────────────────────────────

describe("subscribeToNewsletter", () => {
  let req: { method: string; body: Record<string, unknown> }
  let res: {
    status: jest.Mock
    json: jest.Mock
    send: jest.Mock
  }

  beforeEach(() => {
    req = { method: "POST", body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    }
    process.env.MAILCHIMP_API_KEY = "test-api-key"
    process.env.MAILCHIMP_SERVER_PREFIX = "us1"
    process.env.MAILCHIMP_AUDIENCE_ID = "audience123"
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
    delete process.env.MAILCHIMP_API_KEY
    delete process.env.MAILCHIMP_SERVER_PREFIX
    delete process.env.MAILCHIMP_AUDIENCE_ID
  })

  it("returns 405 for non-POST methods", async () => {
    req.method = "GET"
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.send).toHaveBeenCalledWith("Method Not Allowed")
  })

  it("returns 400 when email is missing", async () => {
    req.body = {}
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: "Formato de e-mail inválido.",
    })
  })

  it("returns 400 for invalid email format", async () => {
    req.body = { email: "not-an-email" }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: "Formato de e-mail inválido.",
    })
  })

  it("returns 400 for disposable email domain", async () => {
    req.body = { email: "user@mailinator.com" }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error:
        "E-mails temporários não são permitidos. Use seu e-mail principal.",
    })
  })

  it("returns 200 and calls Mailchimp with status pending on success", async () => {
    req.body = { email: "user@gmail.com" }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: "abc123" }),
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
    })

    // Verify double opt-in: status must be "pending"
    const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchOptions.body as string)
    expect(body.status).toBe("pending")
    expect(body.email_address).toBe("user@gmail.com")
  })

  it("returns 400 when Mailchimp responds Member Exists", async () => {
    req.body = { email: "user@gmail.com" }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ title: "Member Exists" }),
    })

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: "Este e-mail já está inscrito!",
    })
  })

  it("returns 500 on network or unexpected error", async () => {
    req.body = { email: "user@gmail.com" }
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno no servidor.",
    })
  })

  it("returns 500 when Mailchimp env vars are missing", async () => {
    delete process.env.MAILCHIMP_API_KEY
    req.body = { email: "user@gmail.com" }

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro interno no servidor.",
    })
  })
})
