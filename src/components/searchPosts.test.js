import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { navigate } from 'gatsby';
import SearchPosts from './searchPosts';
import { useFlexSearch } from 'react-use-flexsearch';

jest.mock('react-use-flexsearch', () => ({
  useFlexSearch: jest.fn(),
}));

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
    store: (() => {
      try {
        return JSON.stringify(
          {
            "post": {
              "title": "Test Post 1",
              "date": "2025-03-10",
              "description": "Description for Test Post 1",
              "excerpt": "Excerpt for Test Post 1"
            }
          }
        );
      } catch (error) {
        console.error("Failed to stringify localSearchBlog.store:", error);
        return "{}";
      }
    })(),
  };

  beforeEach(() => {
    useFlexSearch.mockReturnValue([]);
  });

  it('renders correctly with no query', () => {
    const { getByPlaceholderText, getAllByText } = render(
      <SearchPosts
        posts={posts}
        localSearchBlog={localSearchBlog}
        location={{ search: '' }}
        navigate={navigate}
      />
    );

    expect(getByPlaceholderText(/Search all posts/i)).toBeInTheDocument();
    expect(getAllByText(/Test Post 1/i).length).toBeGreaterThan(0)
  });

  it('updates query and calls navigate on input change', () => {
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
