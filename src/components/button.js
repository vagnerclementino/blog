import React from "react"
import styled from "styled-components"

const Button = ({
  background,
  color,
  fontSize,
  fontWeight,
  radius,
  marginTop,
  marginBottom,
  children
}) => (
  <ButtonWrapper
    background={background}
    color={color}
    fontSize={fontSize}
    fontWeight={fontWeight}
    radius={radius}
    marginTop={marginTop}
    marginBottom={marginBottom}
  >
    {children}
  </ButtonWrapper>
)

const ButtonWrapper = styled.button`
  display: block;
  border: none;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  padding: 12px 28px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;

  /* Touch target minimum 44x44px */
  min-height: 44px;
  min-width: 44px;

  /* Ensure sufficient touch area */
  ${props => props.radius && `border-radius: ${props.radius};`}

  background: ${props => props.background || "black"};
  color: ${props => props.color || "rgb(255, 255, 255)"};
  font-size: ${props => props.fontSize || "15px"};
  font-weight: ${props => props.fontWeight || "600"};
  margin-top: ${props => props.marginTop};
  margin-bottom: ${props => props.marginBottom};

  &:hover {
    box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.25);
  }

  &:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }
`

export default Button
