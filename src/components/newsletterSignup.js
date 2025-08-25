import React, { useState } from "react"
import styled from "styled-components"

const NewsletterSignup = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Simulação de envio - você pode integrar com um serviço real como Mailchimp, ConvertKit, etc.
    if (email) {
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus(""), 3000)
    } else {
      setStatus("error")
      setTimeout(() => setStatus(""), 3000)
    }
  }

  return (
    <Container>
      <Content>
        <Title>📬 Newsletter</Title>
        <Description>
          Receba as últimas atualizações do blog diretamente no seu email. 
          Sem spam, apenas conteúdo de qualidade!
        </Description>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <EmailInput
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton type="submit">
              Inscrever-se
            </SubmitButton>
          </InputGroup>
          
          {status === "success" && (
            <StatusMessage $success>
              ✅ Obrigado! Você foi inscrito com sucesso.
            </StatusMessage>
          )}
          
          {status === "error" && (
            <StatusMessage>
              ❌ Por favor, insira um email válido.
            </StatusMessage>
          )}
        </Form>
        
        <Disclaimer>
          * Esta é uma funcionalidade demonstrativa. Para implementar completamente, 
          integre com um serviço de newsletter como Mailchimp ou ConvertKit.
        </Disclaimer>
      </Content>
    </Container>
  )
}

const Container = styled.section`
  margin: 2rem 0;
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

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--textLink);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: var(--textLinkHover);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StatusMessage = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${props => props.$success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.$success ? '#c3e6cb' : '#f5c6cb'};
`

const Disclaimer = styled.small`
  color: var(--textSecondary);
  font-size: 0.75rem;
  line-height: 1.4;
  display: block;
  font-style: italic;
`

export default NewsletterSignup
