import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../atoms/SEO';
import { useStaticQuery } from 'gatsby';

beforeEach(() => {
  HelmetProvider.canUseDOM = false;
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
    const helmetContext: { helmet?: any } = {};
    render(
      <HelmetProvider context={helmetContext}>
        <SEO
          title="Test Page Title"
          description="Test Page Description"
          keywords={['test', 'gatsby', 'react']}
          featureImg="/test-image.jpg"
        />
      </HelmetProvider>
    );

    const { helmet } = helmetContext;

    expect(helmet.title.toString()).toContain('Test Page Title');
    expect(helmet.title.toString()).toContain('Test Site Title');

    const metaStr = helmet.meta.toString();
    expect(metaStr).toContain('Test Page Description');
    expect(metaStr).toContain('Test Author');
    expect(metaStr).toContain("Clementino&#x27;s Notes");

    const linkStr = helmet.link.toString();
    expect(linkStr).toContain('/favicon.svg');
    expect(linkStr).toContain('/favicon-96x96.png');
    expect(linkStr).toContain('/apple-touch-icon.png');
    expect(linkStr).toContain('/site.webmanifest');
  });
});
