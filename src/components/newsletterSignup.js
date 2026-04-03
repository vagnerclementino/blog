import React, { useState } from "react"
import "./newsletterSignup.css"

const NewsletterSignup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email) {
      setStatus("Por favor, preencha nome e email")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus("Sucesso! Verifique seu email.")
        setName("")
        setEmail("")
      } else {
        setStatus(data.message || "Algo deu errado")
      }
    } catch (err) {
      setStatus("Erro de conexão!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="newsletter-signup-form">
      <NewsletterSignupHeader />
      <form
        onSubmit={handleSubmit}
        className="signup-form"
        noValidate
      >
        <InputGroup>
          <InputGroupRow>
            <InputGroupLabel htmlFor="name">Nome</InputGroupLabel>
            <Input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              id="name"
              aria-label="Nome completo"
              required
            />
          </InputGroupRow>
          <InputGroupRow>
            <InputGroupLabel htmlFor="email">Email</InputGroupLabel>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              id="email"
              aria-label="Seu endereço de email"
              required
            />
            <Button type="submit" disabled={isLoading || !name || !email}>
              {isLoading ? "Enviando..." : "Assinar"}
            </Button>
          </InputGroupRow>
        </InputGroup>
        
        {status && (
          <div role="status" aria-live="polite" className="status">
            {status}
          </div>
        )}
        
        <Disclaimer>
          * Esta é uma funcionalidade demonstrativa. Para implementar completamente, 
          integre com um serviço de newsletter como Mailchimp ou ConvertKit.
        </Disclaimer>
      </form>
    </div>
  )
}

export default NewsletterSignup