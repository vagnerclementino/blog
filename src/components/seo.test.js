import React from 'react';
import { render } from '@testing-library/react';
import SEO from './seo';
import { useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet'; // Ensure you're using a version that supports peek()

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: 'Test Site Title',
        description: 'Test Site Description',
        author: 'Test Author',
        siteUrl: 'https://testsite.com',
      },
    },
  });
});

describe('SEO component', () => {
  it('renders correctly with given props', () => {
    render(
      <SEO
        title="Test Page Title"
        description="Test Page Description"
        keywords={['test', 'gatsby', 'react']}
        featureImg="/test-image.jpg"
      />
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toBe('Test Page Title | Test Site Title');
    expect(helmet.metaTags[0].content).toBe('Test Page Description');
    expect(helmet.metaTags[9].content).toBe('Test Author');
  });
});
