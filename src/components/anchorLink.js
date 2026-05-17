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
      {copied ? "✓" : <LinkIcon viewBox="0 0 16 16" aria-hidden="true"><path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-.025 9.45a.75.75 0 01-1.06-1.06l-1.25 1.25a2 2 0 01-2.83-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25z" /></LinkIcon>}
      {copied && <Tooltip>Copiado!</Tooltip>}
    </LinkButton>
  )
}

const LinkButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.65rem;
  color: inherit;
  transition: opacity 0.2s ease;
  padding: 0.25rem;
  margin-left: 0.5rem;
  vertical-align: middle;

  &:hover {
    opacity: 0.6;
  }
`

const LinkIcon = styled.svg`
  width: 1.2em;
  height: 1.2em;
  fill: currentColor;
  stroke: currentColor;
  stroke-width: 1;
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
