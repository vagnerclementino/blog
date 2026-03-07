// Tipos globais para o projeto

import { ReactElement } from 'react';

// Tipos para MDX/MDXBlog
export interface Frontmatter {
  title: string;
  date: string;
  description?: string;
  slug?: string;
  tags?: string[];
  featured?: boolean;
  image?: {
    childImageSharp?: {
      gatsbyImageData: any;
    };
    publicURL?: string;
  };
}

// Props comuns para componentes
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Tipos para Artigo/Blog Post
export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  date: string;
  tags?: string[];
  featuredImage?: string;
  readingTime?: number;
}

// Tipos para Search
export interface SearchResult {
  title: string;
  excerpt: string;
  slug: string;
  tags?: string[];
}

// Tipos para Navegação
export interface NavItem {
  label: string;
  path: string;
  icon?: ReactElement;
}

// Tipos para Configuração do Site
export interface SiteMetadata {
  title: string;
  author: string;
  description: string;
  siteUrl: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface GatsbyConfig {
  siteMetadata: SiteMetadata;
  plugins: any[];
}