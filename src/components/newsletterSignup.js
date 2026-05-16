import React, { useState } from "react"
import styled from "styled-components"
import Mailcheck from "mailcheck"
import Button from "./button"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getFunctionUrl = () => process.env.GATSBY_NEWSLETTER_FUNCTION_URL || ""

const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [suggestion, setSuggestion] = useState(null)
  const [status, setStatus] = useState("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const runMailcheck = value => {
    Mailcheck.run({
      email: value,
      suggested: sugg => setSuggestion(sugg.full),
      empty: () => setSuggestion(null),
    })
  }

  const handleEmailChange = e => {
    const value = e.target.value
    setEmail(value)
    runMailcheck(value)
  }

  const applySuggestion = () => {
    setEmail(suggestion)
    setSuggestion(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!EMAIL_REGEX.test(email)) {
      setStatus("error")
      setStatusMessage("❌ Por favor, insira um email válido.")
      return
    }

    setStatus("loading")
    setStatusMessage("")

    try {
      const response = await fetch(getFunctionUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus("error")
        setStatusMessage(
          `❌ ${data.error || "Ocorreu um erro. Tente novamente."}`
        )
        return
      }

      setStatus("success")
      setStatusMessage(`✅ ${data.message}`)
      setEmail("")
      setSuggestion(null)
    } catch {
      setStatus("error")
      setStatusMessage(
        "❌ Erro de conexão. Verifique sua internet e tente novamente."
      )
    }
  }

  const isLoading = status === "loading"

  return (
    <Container>
      <Content>
        <Title>📬 Newsletter</Title>
        <Description>
          Receba as últimas atualizações do blog diretamente no seu email. Sem
          spam, apenas conteúdo de qualidade!
        </Description>

        <Form onSubmit={handleSubmit} noValidate>
          <InputGroup>
            <EmailInput
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Inscrever-se"}
            </Button>
          </InputGroup>

          {suggestion && (
            <SuggestionMessage>
              Você quis dizer{" "}
              <SuggestionLink
                role="button"
                tabIndex={0}
                onClick={applySuggestion}
                onKeyDown={e => e.key === "Enter" && applySuggestion()}
              >
                {suggestion}
              </SuggestionLink>
              ?
            </SuggestionMessage>
          )}

          {(status === "success" || status === "error") && (
            <StatusMessage $success={status === "success"}>
              {statusMessage}
            </StatusMessage>
          )}
        </Form>
      </Content>
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

const Content = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`

const Title = styled.h3`
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

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const EmailInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--textNormal);
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SuggestionMessage = styled.p`
  font-size: 0.875rem;
  color: var(--textSecondary);
  margin-bottom: 0.5rem;
`

const SuggestionLink = styled.span`
  color: var(--textLink);
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }
`

const StatusMessage = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${props => (props.$success ? "#d4edda" : "#f8d7da")};
  color: ${props => (props.$success ? "#155724" : "#721c24")};
  border: 1px solid ${props => (props.$success ? "#c3e6cb" : "#f5c6cb")};
`

export default NewsletterSignup
