import React, { useState, useEffect } from "react"
import styled from "styled-components"

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      //Altura total da página menos a altura da viewport
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      
      //Posição atual do scroll
      const currentProgress = window.pageYOffset
      
      //Calcula a porcentagem (0-100)
      const scrolled = totalHeight > 0 ? (currentProgress / totalHeight) * 100 : 0
      
      setProgress(Math.min(100, Math.max(0, scrolled)))
    }

    //Atualiza o progresso no carregamento inicial
    updateProgress()

    //Adiciona listener para scroll
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })

    //Cleanup
    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return (
    <ProgressContainer>
      <ProgressBar progress={progress} />
    </ProgressContainer>
  )
}

const ProgressContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1001;
  
  @media (max-width: 768px) {
    height: 3px;
  }
`

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 3px rgba(220, 53, 69, 0.4);
  
  /* Cor vermelha vibrante para melhor visibilidade */
  background: #dc3545 !important;
  
  /* Gradiente sutil para dar profundidade */
  background: linear-gradient(90deg, 
    #dc3545 0%, 
    #c82333 50%, 
    #dc3545 100%
  ) !important;
  
  @media (max-width: 768px) {
    /* Transição mais rápida em mobile para melhor performance */
    transition: width 0.05s ease-out;
  }
`

export default ReadingProgress
