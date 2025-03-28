import React from 'react';
import { render } from '@testing-library/react';
import Layout from './layout';

describe('Layout component', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Layout location={{ pathname: '/' }} title="Test Title">
        <p>Test Content</p>
      </Layout>
    );
    expect(getByText(/Test Title/i)).toBeInTheDocument();
    expect(getByText(/Test Content/i)).toBeInTheDocument();
  });
});
