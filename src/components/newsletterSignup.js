import React, { useState } from "react"
import styled from "styled-components"
import Mailcheck from "mailcheck"
import AnchorLink from "./anchorLink"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const NewsletterSignup = ({ anchorId = null }) => {
  const [name, setName] = useState("")
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
      const firebaseModule = await import("../firebase")
      const { app, functions } = firebaseModule
      if (!app) {
        throw new Error("Firebase não inicializado")
      }

      const { httpsCallable } = await import("firebase/functions")
      const subscribe = httpsCallable(functions, "subscribeToNewsletter")
      const result = await subscribe({ email, name: name.trim() || undefined })
      const data = result.data || {}

      if (data.error) {
        setStatus("error")
        setStatusMessage(`❌ ${data.error}`)
        return
      }

      setStatus("success")
      setStatusMessage(`✅ ${data.message || "Inscrição realizada"}`)
      setName("")
      setEmail("")
      setSuggestion(null)
    } catch (err) {
      const errorMessage = err?.message || ""
      if (errorMessage.includes("UNAUTHENTICATED")) {
        setStatus("error")
        setStatusMessage("❌ Erro de autenticação. Recarregue a página e tente novamente.")
      } else {
        setStatus("error")
        setStatusMessage(
          "❌ Erro de conexão. Verifique sua internet e tente novamente."
        )
      }
    }
  }

  const isLoading = status === "loading"

  return (
    <Container>
      <Content>
        <Title>📬 Newsletter {anchorId && <AnchorLink id={anchorId} />}</Title>
        <Description>
          Receba as últimas atualizações do blog diretamente no seu email. Sem
          spam, apenas conteúdo de qualidade!
        </Description>

        <Form onSubmit={handleSubmit} noValidate>
          <InlineRow>
            <NameInput
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isLoading}
            />
            <EmailInput
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              required
            />
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar"}
            </SubmitButton>
          </InlineRow>

          {isLoading && (
            <LoadingMessage>
              <Spinner aria-hidden="true" />
              Processando sua inscrição, aguarde...
            </LoadingMessage>
          )}

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
  background: var(--bg, #ffffff);
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
  color: var(--textNormal, #333333);
  font-size: 1.25rem;
`

const Description = styled.p`
  color: var(--textSecondary, #666666);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const Form = styled.form`
  margin-bottom: 1rem;
`

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const NameInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--textNormal, #333333);
  border-radius: 4px;
  background: var(--bg, #ffffff);
  color: var(--textNormal, #333333);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:focus {
    outline: none;
    border-color: var(--textLink, #007acc);
  }

  &::placeholder {
    color: var(--textSecondary, #999999);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const EmailInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--textNormal, #333333);
  border-radius: 4px;
  background: var(--bg, #ffffff);
  color: var(--textNormal, #333333);
  font-size: 0.9rem;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:focus {
    outline: none;
    border-color: var(--textLink, #007acc);
  }

  &::placeholder {
    color: var(--textSecondary, #999999);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SubmitButton = styled.button`
  padding: 10px 25px;
  border: none;
  border-radius: 6px;
  background: black;
  color: rgb(255, 255, 255);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 25px;
    font-size: 13px;
  }
`

const SuggestionMessage = styled.p`
  font-size: 0.875rem;
  color: var(--textSecondary, #666666);
  margin-bottom: 0.5rem;
`

const SuggestionLink = styled.span`
  color: var(--textLink, #007acc);
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

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: #e8f4fd;
  color: #0c5460;
  border: 1px solid #bee5eb;
  margin-bottom: 0.5rem;
`

const Spinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #0c5460;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default NewsletterSignup
