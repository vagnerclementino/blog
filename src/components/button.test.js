import React from 'react';
import { render } from '@testing-library/react';
import 'jest-styled-components';
import Button from './button';

describe('Button component', () => {
  it('applies default styles', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.firstChild).toHaveStyleRule('background', 'black');
    expect(container.firstChild).toHaveStyleRule('color', 'rgb(255, 255, 255)');
    expect(container.firstChild).toHaveStyleRule('font-size', '15px');
    expect(container.firstChild).toHaveStyleRule('font-weight', '600');
    expect(container.firstChild).toHaveStyleRule('border-radius', '6px');
  });

  it('applies custom styles from props', () => {
    const { container } = render(
      <Button
        background="blue"
        color="white"
        fontSize="20px"
        fontWeight="700"
        radius="10px"
      >
        Click me
      </Button>
    );
    expect(container.firstChild).toHaveStyleRule('background', 'blue');
    expect(container.firstChild).toHaveStyleRule('color', 'white');
    expect(container.firstChild).toHaveStyleRule('font-size', '20px');
    expect(container.firstChild).toHaveStyleRule('font-weight', '700');
    expect(container.firstChild).toHaveStyleRule('border-radius', '10px');
  });
});
