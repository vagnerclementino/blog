import React, { useState } from "react"
import styled from "styled-components"
import Button from "./button" // Assuming Button is available locally

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
    <Container>
      <Header>📬 Newsletter</Header>
      <Description>
        Receba as últimas atualizações do blog diretamente no seu email. Sem spam, apenas conteúdo de qualidade!
      </Description>

      <Form onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <FieldRow>
            <Label htmlFor="name">Nome</Label>
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
          </FieldRow>
          <FieldRow>
            <Label htmlFor="email">Email</Label>
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
          </FieldRow>
        </FieldGroup>
        {status && (
          <StatusMessage role="status" aria-live="polite">
            {status}
          </StatusMessage>
        )}
        <Disclaimer>
          * Esta é uma funcionalidade demonstrativa. Para implementar completamente, 
          integre com um serviço de newsletter como Mailchimp ou ConvertKit.
        </Disclaimer>
      </Form>
    </Container>
  )
}

const Container = styled.section`
  margin: 2rem auto;
  max-width: 800px;
  background: var(--bg);
  border: 1px solid var(--textNormal);
  border-radius: 8px;
  overflow: hidden;
`

const Header = styled.h3`
  margin: 0 0 1rem 0;
  color: var(--textNormal);
  font-size: 1.25rem;
`

const Description = styled.p`
  color: var(--textSecondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const Form = styled.form`
  margin-bottom: 1rem;
`

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Label = styled.label`
  min-width: 60px;
  color: var(--textNormal);
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--textNormal);
  border-radius: 4px;
  background: var(--bg);
  color: var(--textNormal);
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--textLink);
  }

  &::placeholder {
    color: var(--textSecondary);
  }
`

const StatusMessage = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${props => props.children && props.children.toString().startsWith('Sucesso') ? '#d4edda' : '#f8d7da'};
  color: ${props => props.children && props.children.toString().startsWith('Sucesso') ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.children && props.children.toString().startsWith('Sucesso') ? '#c3e6cb' : '#f5c6cb'};
`

const Disclaimer = styled.small`
  color: var(--textSecondary);
  font-size: 0.75rem;
  line-height: 1.4;
  display: block;
  font-style: italic;
`

export default NewsletterSignup
