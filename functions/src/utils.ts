import disposableDomains from "disposable-email-domains"

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split("@")[1]
  if (!domain) return false
  return disposableDomains.includes(domain)
}
