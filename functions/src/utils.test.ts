import { isValidEmail, isDisposableEmail } from "./utils"

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
