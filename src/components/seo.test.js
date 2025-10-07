import React from 'react';
import { render } from '@testing-library/react';
import SEO from './seo';
import { useStaticQuery } from 'gatsby';
import { Helmet } from 'react-helmet'; 

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
    
    //Test title
    expect(helmet.title).toBe('Test Page Title | Test Site Title');
    
    //Test meta tags by finding specific ones
    const descriptionMeta = helmet.metaTags.find(tag => tag.name === 'description');
    expect(descriptionMeta.content).toBe('Test Page Description');
    
    const twitterCreatorMeta = helmet.metaTags.find(tag => tag.name === 'twitter:creator');
    expect(twitterCreatorMeta.content).toBe('Test Author');
    
    const appleMobileWebAppTitleMeta = helmet.metaTags.find(tag => tag.name === 'apple-mobile-web-app-title');
    expect(appleMobileWebAppTitleMeta.content).toBe("Clementino's Notes");
    
    //Test link tags for favicon
    const faviconSvgLink = helmet.linkTags.find(link => link.rel === 'icon' && link.type === 'image/svg+xml');
    expect(faviconSvgLink.href).toBe('/favicon.svg');
    
    const faviconPngLink = helmet.linkTags.find(link => link.rel === 'icon' && link.type === 'image/png');
    expect(faviconPngLink.href).toBe('/favicon-96x96.png');
    expect(faviconPngLink.sizes).toBe('96x96');
    
    const appleTouchIconLink = helmet.linkTags.find(link => link.rel === 'apple-touch-icon');
    expect(appleTouchIconLink.href).toBe('/apple-touch-icon.png');
    expect(appleTouchIconLink.sizes).toBe('180x180');
    
    const manifestLink = helmet.linkTags.find(link => link.rel === 'manifest');
    expect(manifestLink.href).toBe('/site.webmanifest');
  });
});
