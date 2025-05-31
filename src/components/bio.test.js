import React from 'react';
import { render } from '@testing-library/react';
import { StaticQuery } from 'gatsby';
import Bio from './bio';

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          author: 'Test Author',
          social: {
            twitter: 'testauthor',
          },
        },
      },
    })
  );
});

describe('Bio component', () => {
  // Test for author name presence
  it('renders author name correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/Test Author/)).toBeInTheDocument();
  });

  // Test for twitter handle presence 
  it('renders twitter handle correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/@testauthor/)).toBeInTheDocument();
  });

  // Test for bio text
  it('renders bio text correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/Written by/i)).toBeInTheDocument();
  });
});
