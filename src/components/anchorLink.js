import React, { useState } from "react"
import styled from "styled-components"

const AnchorLink = ({ id }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <LinkButton
      onClick={handleCopy}
      title={copied ? "Link copiado!" : "Copiar link desta seção"}
      aria-label={`Copiar link para seção ${id}`}
    >
      {copied ? "✓" : "🔗"}
      {copied && <Tooltip>Copiado!</Tooltip>}
    </LinkButton>
  )
}

const LinkButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  padding: 0.25rem;
  margin-left: 0.5rem;
  vertical-align: middle;

  &:hover {
    opacity: 1;
  }
`

const Tooltip = styled.span`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
`

export default AnchorLink
