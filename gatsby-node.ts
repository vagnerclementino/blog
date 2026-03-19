import path from 'path';
import type { GatsbyNode } from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';
import readingTime from 'reading-time';

type BlogPostNode = {
  fields: {
    slug: string;
  };
  frontmatter?: {
    title?: string | null;
  } | null;
  internal: {
    contentFilePath: string;
  };
};

type CreatePagesQueryResult = {
  allMdx: {
    edges: Array<{
      node: BlogPostNode;
    }>;
  };
};

type ReadingTimeStats = ReturnType<typeof readingTime>;

const FALLBACK_READING_TIME: ReadingTimeStats = {
  text: '1 min read',
  minutes: 1,
  time: 60000,
  words: 0,
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const blogPost = path.resolve('./src/templates/blog-post.tsx');

  const result = await graphql<CreatePagesQueryResult>(`{
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
  }`);

  if (result.errors) {
    throw result.errors;
  }

  const posts = result.data?.allMdx.edges ?? [];

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: `blog${post.node.fields.slug}`,
      component: `${blogPost}?__contentFilePath=${post.node.internal.contentFilePath}`,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({
      node,
      getNode,
      basePath: 'content/blog/',
    });

    createNodeField({
      name: 'slug',
      node,
      value,
    });

    const mdxNode = node as typeof node & { body?: string };
    const content = mdxNode.body ?? '';
    let stats = FALLBACK_READING_TIME;

    try {
      stats = readingTime(content);
    } catch (error) {
      console.warn(`Failed to calculate reading time for node ${node.id}:`, error);
    }

    createNodeField({
      name: 'readingTime',
      node,
      value: stats,
    });
  }
};
