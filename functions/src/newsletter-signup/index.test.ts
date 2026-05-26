// Mocks must be declared before imports (Jest hoists jest.mock calls)
const mockHandler = jest.fn()
jest.mock("firebase-functions/v2/https", () => ({
  onCall: (_options: unknown, handler: unknown) => {
    mockHandler.mockImplementation(handler as (...args: unknown[]) => unknown)
    return handler
  },
}))

jest.mock("firebase-functions/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}))

jest.mock("firebase-admin", () => ({
  apps: [{}],
  initializeApp: jest.fn(),
}))

import { isValidEmail, isDisposableEmail, subscribeToNewsletter } from "./index"

// The handler extracted from onCall
type CallableRequest = { data: Record<string, unknown> }
const handler = subscribeToNewsletter as unknown as (request: CallableRequest) => Promise<Record<string, string>>

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

// ─── subscribeToNewsletter (onCall handler) ───────────────────────────────────

describe("subscribeToNewsletter", () => {
  beforeEach(() => {
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

  it("returns error when email is missing", async () => {
    const result = await handler({ data: {} })
    expect(result).toEqual({ error: "Formato de e-mail inválido." })
  })

  it("returns error for invalid email format", async () => {
    const result = await handler({ data: { email: "not-an-email" } })
    expect(result).toEqual({ error: "Formato de e-mail inválido." })
  })

  it("returns error for disposable email domain", async () => {
    const result = await handler({ data: { email: "user@mailinator.com" } })
    expect(result).toEqual({
      error: "E-mails temporários não são permitidos. Use seu e-mail principal.",
    })
  })

  it("returns success and calls Mailchimp with status pending", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: "abc123" }),
    })

    const result = await handler({ data: { email: "user@gmail.com" } })

    expect(result).toEqual({
      message: "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
    })

    // Verify double opt-in: status must be "pending"
    const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchOptions.body as string)
    expect(body.status).toBe("pending")
    expect(body.email_address).toBe("user@gmail.com")
  })

  it("returns error when Mailchimp responds Member Exists", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ title: "Member Exists" }),
    })

    const result = await handler({ data: { email: "user@gmail.com" } })

    expect(result).toEqual({ error: "Este e-mail já está inscrito!" })
  })

  it("returns error on network or unexpected error", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"))

    const result = await handler({ data: { email: "user@gmail.com" } })

    expect(result).toEqual({ error: "Erro interno no servidor." })
  })

  it("returns error when Mailchimp env vars are missing", async () => {
    delete process.env.MAILCHIMP_API_KEY

    const result = await handler({ data: { email: "user@gmail.com" } })

    expect(result).toEqual({ error: "Erro interno no servidor." })
  })

  it("sends merge_fields with FNAME and LNAME when name is provided", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: "abc123" }),
    })

    await handler({ data: { email: "user@gmail.com", name: "João Silva" } })

    const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchOptions.body as string)
    expect(body.merge_fields).toEqual({ FNAME: "João", LNAME: "Silva" })
  })

  it("sends merge_fields with empty strings when name is not provided", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: "abc123" }),
    })

    await handler({ data: { email: "user@gmail.com" } })

    const [, fetchOptions] = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchOptions.body as string)
    expect(body.merge_fields).toEqual({ FNAME: "", LNAME: "" })
  })
})
