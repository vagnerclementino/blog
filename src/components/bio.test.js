import React from 'react';
import { render } from '@testing-library/react';
import { StaticQuery } from 'gatsby';

jest.mock('gatsby', () => ({
  ...jest.requireActual('gatsby'),
  StaticQuery: jest.fn(),
  graphql: jest.fn(),
}));

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
import Bio from './bio';

describe('Bio component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Bio />);
    expect(getByText(/Written by/i)).toBeInTheDocument();
  });
});
