import { onRequest } from "firebase-functions/v2/https"
import * as logger from "firebase-functions/logger"
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
export const subscribeToNewsletter = onRequest(
  {
    cors: true,
    invoker: "public",
    secrets: [
      "MAILCHIMP_API_KEY",
      "MAILCHIMP_SERVER_PREFIX",
      "MAILCHIMP_AUDIENCE_ID",
    ],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed")
      return
    }

    const { email } = req.body as { email?: string }

    // 1. Validação de Sintaxe
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: "Formato de e-mail inválido." })
      return
    }

    // 2. Bloqueio de E-mails Temporários
    if (isDisposableEmail(email)) {
      res.status(400).json({
        error:
          "E-mails temporários não são permitidos. Use seu e-mail principal.",
      })
      return
    }

    // Variáveis do Mailchimp (via Firebase Secret Manager / env)
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = process.env.MAILCHIMP_SERVER_PREFIX
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

    if (!API_KEY || !DATACENTER || !AUDIENCE_ID) {
      logger.error("Variáveis do Mailchimp não configuradas")
      res.status(500).json({ error: "Erro interno no servidor." })
      return
    }

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "pending", // Aciona o Double Opt-in nativo
        }),
      })

      const data = (await response.json()) as {
        title?: string
        detail?: string
      }

      if (!response.ok) {
        if (data.title === "Member Exists") {
          res.status(400).json({ error: "Este e-mail já está inscrito!" })
          return
        }
        throw new Error(data.detail ?? "Erro na API do Mailchimp")
      }

      res.status(200).json({
        message:
          "Por favor, verifique sua caixa de entrada para confirmar a inscrição!",
      })
    } catch (error) {
      logger.error("Erro na integração", error)
      res.status(500).json({ error: "Erro interno no servidor." })
    }
  }
)
