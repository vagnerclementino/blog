import { onCall } from "firebase-functions/v2/https"
import * as logger from "firebase-functions/logger"
import disposableDomains from "disposable-email-domains"
import admin from "firebase-admin"

if (!admin.apps.length) admin.initializeApp()

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split("@")[1]
  if (!domain) return false
  return disposableDomains.includes(domain)
}
export const subscribeToNewsletter = onCall(
  {
    enforceAppCheck: !process.env.FUNCTIONS_EMULATOR,
  },
  async (request) => {
    const { email, name } = request.data as { email?: string; name?: string }

    if (!email || !isValidEmail(email)) {
      logger.warn("Formato de e-mail inválido.")
      return { error: "Formato de e-mail inválido." }
    }

    if (isDisposableEmail(email)) {
      return {
        error: "E-mails temporários não são permitidos. Use seu e-mail principal.",
      }
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = process.env.MAILCHIMP_SERVER_PREFIX
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

    if (!API_KEY || !DATACENTER || !AUDIENCE_ID) {
      logger.error("Variáveis do Mailchimp não configuradas")
      return { error: "Erro interno no servidor." }
    }

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

    const body: Record<string, unknown> = {
      email_address: email,
      status: "pending",
    }

    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/)
      body.merge_fields = {
        FNAME: parts[0],
        LNAME: parts.slice(1).join(" ") || "",
      }
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = (await response.json()) as {
        title?: string
        detail?: string
      }

      if (!response.ok) {
        if (data.title === "Member Exists") {
          return { error: "Este e-mail já está inscrito!" }
        }
        throw new Error(data.detail ?? "Erro na API do Mailchimp")
      }

      return {
        message:
          "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
      }
    } catch (error) {
      logger.error("Erro na integração", error)
      return { error: "Erro interno no servidor." }
    }
  }
)
