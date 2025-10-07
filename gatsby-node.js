const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const readingTime = require('reading-time')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `{
  allMdx(
    sort: {frontmatter: {date: DESC}}
    filter: {fields: {released: {eq: true}}}
  ) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
        }
        internal {
          contentFilePath
        }
      }
    }
  }
}`
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    //Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `blog${post.node.fields.slug}`,
        component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    return null
  });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ 
      node, 
      getNode,
      basePath: `content/blog/`
    })
    createNodeField({
      name: `slug`,
      node,
      value,
    })

    const content = node.body || '';
    let stats = { text: '1 min read', minutes: 1, time: 60000, words: 0 };
    try {
      stats = readingTime(content);
    } catch (error) {
      console.warn(`Failed to calculate reading time for node ${node.id}:`, error);
    }
    createNodeField({
      name: `readingTime`,
      node,
      value: stats,
    })
  }
}
