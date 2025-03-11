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
  it('renders correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/Written by/i)).toBeInTheDocument();
  });
});
