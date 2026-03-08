import type { GatsbyConfig } from 'gatsby';
import rehypeRewrite from 'rehype-rewrite';
import remarkGfm from 'remark-gfm';

type MinimalNode = {
  type?: string;
  tagName?: string;
  properties?: {
    id?: string;
  };
  children?: Array<{
    type?: string;
    value?: string;
  }>;
};

type LocalSearchNormalizerData = {
  allMdx: {
    nodes: Array<{
      id: string;
      fields: {
        slug: string;
      };
      excerpt: string;
      body: string;
      frontmatter: {
        title: string;
        description: string;
        date: string;
      };
    }>;
  };
};

type FeedQueryData = {
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
  allMdx: {
    edges: Array<{
      node: {
        excerpt: string;
        fields: {
          slug: string;
        };
        frontmatter: {
          title: string;
          date: string;
          description: string;
        };
      };
    }>;
  };
};

const isFootnoteHeader = (node: unknown): node is MinimalNode => {
  const {
    type,
    tagName,
    properties: { id } = {},
    children: [firstChild] = [],
  } = (node as MinimalNode) || {};

  return (
    type === 'element' &&
    tagName === 'h2' &&
    id === 'footnote-label' &&
    firstChild?.type === 'text' &&
    firstChild?.value === 'Footnotes'
  );
};

const localizeFootnotesTitle = (node: unknown): void => {
  if (isFootnoteHeader(node)) {
    const [firstChild] = node.children || [];
    if (firstChild) {
      firstChild.value = 'Referências';
    }
  }
};

const config: GatsbyConfig = {
  trailingSlash: 'always',
  siteMetadata: {
    title: `Clementino's Notes`,
    author: `Vagner Clementino`,
    description: `A personal blog with styled components and dark mode`,
    siteUrl: `https://notes.clementino.me`,
    language: `pt-BR`,
    social: {
      twitter: `vclementino`,
    },
  },
  flags: {
    DEV_SSR: false,
    FAST_DEV: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-RJC3FZKQTT'],
        pluginConfig: {
          head: true,
        },
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {},
    },
    `gatsby-plugin-offline`,
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        name: 'blog',
        engine: 'flexsearch',
        engineOptions: {
          encode: 'icase',
          tokenize: 'forward',
          async: false,
        },
        query: `
          {
            allMdx {
              nodes {
                id
                fields { slug }
                excerpt
                body
                frontmatter {
                  title
                  description
                  date(formatString: "MMMM DD, YYYY")
                }
              }
            }
          }
        `,
        ref: 'id',
        index: ['title', 'body', 'description'],
        store: ['id', 'slug', 'date', 'title', 'excerpt', 'description'],
        normalizer: ({ data }: { data: LocalSearchNormalizerData }) =>
          data.allMdx.nodes.map((node) => ({
            id: node.id,
            slug: node.fields.slug,
            body: node.body,
            excerpt: node.excerpt,
            title: node.frontmatter.title,
            description: node.frontmatter.description,
            date: node.frontmatter.date,
          })),
      },
    },
    `gatsby-plugin-root-import`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${process.cwd()}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${process.cwd()}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypeRewrite,
              {
                rewrite: localizeFootnotesTitle,
              },
            ],
          ],
          format: 'mdx',
        },
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-embed-youtube',
            options: {
              width: 800,
              height: 400,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
              escapeEntities: {},
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },
          {
            resolve: `gatsby-remark-smartypants`,
          },
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `clementino`,
      },
    },
    {
      resolve: 'gatsby-plugin-released',
      options: {
        fieldName: 'released',
        timezone: 'America/Sao_Paulo',
        force: process.env.NODE_ENV === 'development',
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({
              query: { site, allMdx },
            }: {
              query: FeedQueryData;
            }) =>
              allMdx.edges.map((edge) =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.excerpt }],
                }),
              ),
            query: `
              {
                allMdx(
                  sort: { frontmatter: { date: DESC } }
                  filter: { fields: { released: { eq: true } } }
                ) {
                  edges {
                    node {
                      excerpt
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: "Clementino's Notes RSS Feed",
            match: '^/blog/',
          },
        ],
      },
    },
  ],
};

export default config;
