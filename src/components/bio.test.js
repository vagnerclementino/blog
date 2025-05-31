import React from 'react';
import { render } from '@testing-library/react';
import Bio from './bio';

// No need to mock useStaticQuery here as it's already mocked in __mocks__/gatsby.js

describe('Bio component', () => {
  it('renders author name correctly', () => {
    const { getByText } = render(<Bio />);
    const authorElement = getByText(/Test Author/);
    expect(authorElement).toBeInTheDocument();
  });

  it('renders twitter link correctly', () => {
    const { getByText } = render(<Bio />);
    const twitterLink = getByText(/Follow me on Twitter/i);
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink.href).toBe('https://twitter.com/testauthor');
  });

  it('renders bio text correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/Written by/i)).toBeInTheDocument();
  });
});
