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
            "3c1c0b1b-18bf-57c9-8ea6-e147bc52679a": {
              "id": "3c1c0b1b-18bf-57c9-8ea6-e147bc52679a",
              "slug": "/introducao-teste-de-carga/",
              "date": "August 25, 2022",
              "title": "Introdução ao Teste de Carga",
              "excerpt": "Excerpt for Introdução ao Teste de Carga",
              "description": "Entendendo os limites do sistema"
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
    console.log(typeof localSearchBlog.store)
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
