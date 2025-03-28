import React from "react"
import styled from "styled-components"

const ScrollContainer = styled.div`
  position: relative;
  padding: 1.5rem;
  margin: 1.5rem 0 2.5rem;
  background: #fffaf0;
  border: 1px solid #e8e0d0;
  border-radius: 8px 0 0 8px;
  box-shadow: 
    0 1px 4px rgba(0,0,0,0.1),
    inset 0 0 30px rgba(0,0,0,0.03),
    10px 10px 0 -5px #f5f0e6,
    10px 10px 0 0 #e8e0d0;
  color: #4a4238;
  font-size: 1.4rem;
  line-height: 2.2;
  padding-left: 2.5rem;
  overflow: hidden;
  transform-style: preserve-3d;
  font-family: 'Dancing Script', 'Segoe Script', cursive, sans-serif;
  
  /* Efeito de enrolar no canto superior direito */
  &:before {
    content: "";
    position: absolute;
    top: 10px;
    right: 10px;
    width: 50%;
    height: 30%;
    background: linear-gradient(
      to left bottom,
      transparent 50%,
      rgba(0,0,0,0.03) 50%,
      rgba(0,0,0,0.06) 53%,
      rgba(0,0,0,0.03) 56%,
      transparent 60%
    );
    transform: rotateZ(5deg) skewX(5deg);
    z-index: 1;
  }

  /* Efeito de sombra do enrolamento */
  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 30%;
    background: linear-gradient(
      to left bottom,
      transparent,
      rgba(0,0,0,0.03)
    );
    transform: rotateZ(5deg) skewX(5deg);
    filter: blur(2px);
    z-index: 0;
  }

  /* Borda esquerda mais espessa */
  border-left: 12px solid #f0e6d2;
  border-image: linear-gradient(
    to bottom,
    #f0e6d2,
    #e8dcc8,
    #f0e6d2
  ) 1 100%;
  border-radius: 0 8px 8px 0;

  @media (min-width: 768px) {
    padding: 2rem 3rem;
    margin: 2rem 0 3.5rem;
    font-size: 1.8rem;
    padding-left: 3.5rem;
    box-shadow: 
      0 1px 4px rgba(0,0,0,0.1),
      inset 0 0 30px rgba(0,0,0,0.03),
      15px 15px 0 -7px #f5f0e6,
      15px 15px 0 0 #e8e0d0;
    
    &:before, &:after {
      width: 40%;
      height: 25%;
    }
  }

  /* Textura de papel */
  background-image: 
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 20px 20px;
`

const ScrollQuote = ({ children }) => {
  return (
    <ScrollContainer>
      {children}
    </ScrollContainer>
  )
}

export default ScrollQuote
