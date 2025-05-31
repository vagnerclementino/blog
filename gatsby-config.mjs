const homepageURL = process.env.HOMEPAGE_URL || 'https://clementino.me'

// Import remark-footnotes using ES module syntax
import remarkFootnotes from 'remark-footnotes'

export default {
  trailingSlash: 'always',
  siteMetadata: {
    // edit below
    title: `Clementino's Notes`,
    author: `Vagner Clementino`,
    description: `A personal blog with styled components and dark mode`,
    siteUrl: `https://notes.clementino.me`,
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
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "blog",
        engine: "flexsearch",
        engineOptions: {
          encode: "icase",
          tokenize: "forward",
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
        ref: "id",
        index: ["title", "body", "description"],
        store: ["id", "slug", "date", "title", "excerpt", "description"],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
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
        extensions: [".mdx", ".md"],
        mdxOptions: {
          remarkPlugins: [remarkFootnotes],
          rehypePlugins: [],
          format: 'mdx',
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              showCaptions: true
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
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
              target: "_blank",
              rel: "noreferrer noopener",
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
      resolve: "gatsby-plugin-released",
      options: {
        fieldName: "released",
        timezone: "America/Sao_Paulo",
        force: process.env.NODE_ENV === "development",
      },
    },
  ],
}