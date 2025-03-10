import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { navigate } from 'gatsby';
import SearchPosts from './searchPosts';

describe('SearchPosts component', () => {
  const posts = [
    {
      node: {
        frontmatter: {
          title: 'Test Post 1',
          date: '2025-03-10',
          description: 'Description for Test Post 1',
        },
        fields: {
          slug: '/test-post-1',
        },
        excerpt: 'Excerpt for Test Post 1',
      },
    },
  ];

  const localSearchBlog = {
    index: 'test-index',
    store: {
      '/test-post-1': {
        title: 'Test Post 1',
        date: '2025-03-10',
        description: 'Description for Test Post 1',
        excerpt: 'Excerpt for Test Post 1',
      },
    },
  };

  it('renders correctly with no query', () => {
    console.log(localSearchBlog.store)
    const { getByPlaceholderText, getByText } = render(
      <SearchPosts
        posts={posts}
        localSearchBlog={localSearchBlog}
        location={{ search: '' }}
        navigate={navigate}
      />
    );

    expect(getByPlaceholderText(/Search all posts/i)).toBeInTheDocument();
    expect(getByText(/Test Post 1/i)).toBeInTheDocument();
  });

  it('updates query and calls navigate on input change', () => {
    console.log(localSearchBlog.store)

    const { getByPlaceholderText } = render(
      <SearchPosts
        posts={posts}
        localSearchBlog={localSearchBlog}
        location={{ search: '' }}
        navigate={navigate}
      />
    );

    const input = getByPlaceholderText(/Search all posts/i);
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(navigate).toHaveBeenCalledWith('/blog/?search=Test');
  });
});
