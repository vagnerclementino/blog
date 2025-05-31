const homepageURL = process.env.HOMEPAGE_URL || 'https://clementino.me'

module.exports = {
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
    DEV_SSR: true,
    FAST_DEV: true,
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
    `gatsby-plugin-react-helmet`,
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
        index: ["title", "body"],
        store: ["id", "slug", "date", "title", "excerpt", "description"],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
            id: node.id,
            slug: node.fields.slug,
            rawBody: node.body,
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
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          // `gatsby-remark-reading-time`,
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
          // {
          //   resolve: `gatsby-remark-vscode`,
          //   options: {
          //     theme: 'Dark+ (default dark)',
          //     extensions: [],
          //     inlineCode: {
          //       marker: '•'
          //     }
          //   }
          // },
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
          {
            resolve: `gatsby-remark-footnotes`,
            options: {
              footnoteBackRefPreviousElementDisplay: "inline",
              footnoteBackRefDisplay: "inline",
              footnoteBackRefInnerText: "👋", // Defaults to: "↩"
              //use if you want the Wikipedia style ^ link without an underline beneath it
              footnoteBackRefAnchorStyle: `text-decoration: none;`,
              //use "front" for Wikipedia style ^ links
              footnoteBackRefInnerTextStartPosition: "front",
              useFootnoteMarkerText: true, // Defaults to false
              useCustomDivider: "<hr/><strong>References:</strong>", // Defaults to <hr/>
            },
          },
        ],
        mdxOptions: {
          remarkPlugins: [/* Adicione plugins remark se necessário */],
          rehypePlugins: [/* Adicione plugins rehype se necessário */],
        },
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
    }
  ],
}
