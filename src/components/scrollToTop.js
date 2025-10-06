import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp } from "@fortawesome/free-solid-svg-icons"

const ScrollToTop = ({ showOffset = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      //Mostra o botão quando o usuário rola mais que showOffset pixels
      if (window.pageYOffset > showOffset) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [showOffset])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <ScrollButton
      onClick={scrollToTop}
      isVisible={isVisible}
      title="Voltar ao topo"
      aria-label="Voltar ao topo da página"
    >
      <FontAwesomeIcon icon={faChevronUp} />
    </ScrollButton>
  )
}

const ScrollButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isVisible'
})`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--textLink);
  color: var(--bg);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: ${props => props.isVisible ? 'translateY(0)' : 'translateY(10px)'};

  &:hover {
    background: var(--textNormal);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
    font-size: 1rem;
  }
`

export default ScrollToTop
