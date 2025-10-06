import React from "react"
import { render, screen } from "@testing-library/react"
import FeaturedPosts from "./featuredPosts"

// Mock do Gatsby Link
jest.mock("gatsby", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

// Mock Font Awesome
jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon?.iconName || icon} {...props} />
  ),
}))

// Mock PostCard
jest.mock("./postCard", () => {
  return function MockPostCard({ post }) {
    return (
      <div data-testid="post-card">
        <h3>{post.frontmatter.title}</h3>
        <p>{post.frontmatter.date}</p>
        <a href={post.fields.slug}>Ler mais</a>
      </div>
    )
  }
})

// Mock Swiper
jest.mock('swiper/react', () => ({
  Swiper: ({ children, pagination, ...props }) => (
    <div data-testid="swiper" {...props}>
      {children}
      {pagination && (
        <div className="swiper-pagination">
          <span className="swiper-pagination-bullet swiper-pagination-bullet-active"></span>
          <span className="swiper-pagination-bullet"></span>
          <span className="swiper-pagination-bullet"></span>
        </div>
      )}
    </div>
  ),
  SwiperSlide: ({ children, ...props }) => (
    <div data-testid="swiper-slide" {...props}>
      {children}
    </div>
  ),
}))

jest.mock('swiper/modules', () => ({
  Navigation: 'Navigation',
  Pagination: 'Pagination',
  Autoplay: 'Autoplay',
}))

const mockPosts = [
  {
    node: {
      fields: { slug: "/post-1/" },
      frontmatter: {
        title: "Post 1",
        date: "01/01/2024",
        description: "Description for post 1",
      },
      excerpt: "Excerpt for post 1",
    },
  },
  {
    node: {
      fields: { slug: "/post-2/" },
      frontmatter: {
        title: "Post 2", 
        date: "02/01/2024",
        description: "Description for post 2",
      },
      excerpt: "Excerpt for post 2",
    },
  },
  {
    node: {
      fields: { slug: "/post-3/" },
      frontmatter: {
        title: "Post 3",
        date: "03/01/2024", 
        description: "Description for post 3",
      },
      excerpt: "Excerpt for post 3",
    },
  },
  {
    node: {
      fields: { slug: "/post-4/" },
      frontmatter: {
        title: "Post 4",
        date: "04/01/2024",
        description: "Description for post 4",
      },
      excerpt: "Excerpt for post 4",
    },
  },
]

const mockPostsWithFeatured = [
  {
    node: {
      fields: { slug: "/featured-1/" },
      frontmatter: {
        title: "Featured Post 1",
        date: "01/01/2024",
        description: "Description for featured post 1",
        featured: true,
      },
      excerpt: "Excerpt for featured post 1",
    },
  },
  {
    node: {
      fields: { slug: "/regular-1/" },
      frontmatter: {
        title: "Regular Post 1",
        date: "02/01/2024",
        description: "Description for regular post 1",
      },
      excerpt: "Excerpt for regular post 1",
    },
  },
  {
    node: {
      fields: { slug: "/featured-2/" },
      frontmatter: {
        title: "Featured Post 2",
        date: "03/01/2024",
        description: "Description for featured post 2",
        featured: true,
      },
      excerpt: "Excerpt for featured post 2",
    },
  },
]

describe("FeaturedPosts", () => {
  it("renders featured posts section with Font Awesome icon", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getByText("Posts em Destaque")).toBeInTheDocument()
    expect(screen.getByTestId("font-awesome-icon")).toBeInTheDocument()
    expect(screen.getByTestId("font-awesome-icon")).toHaveAttribute("data-icon", "heart")
  })

  it("displays posts with featured: true when available", () => {
    render(<FeaturedPosts posts={mockPostsWithFeatured} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 2")).toBeInTheDocument()
    expect(screen.queryByText("Regular Post 1")).not.toBeInTheDocument()
  })

  it("falls back to first 3 posts when no featured posts exist", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
    expect(screen.getByText("Post 1")).toBeInTheDocument()
    expect(screen.getByText("Post 2")).toBeInTheDocument()
    expect(screen.getByText("Post 3")).toBeInTheDocument()
    expect(screen.queryByText("Post 4")).not.toBeInTheDocument()
  })

  it("renders Swiper carousel component", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getByTestId("swiper")).toBeInTheDocument()
    const slides = screen.getAllByTestId("swiper-slide")
    expect(slides).toHaveLength(3)
  })

  it("shows featured badge on each post", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    const badges = screen.getAllByText("Destaque")
    expect(badges).toHaveLength(3)
  })

  it("renders nothing when no posts provided", () => {
    const { container } = render(<FeaturedPosts posts={[]} />)
    
    expect(container.firstChild).toBeNull()
  })

  it("displays pagination bullets for navigation", () => {
    render(<FeaturedPosts posts={mockPostsWithFeatured} />)
    
    // Verifica se existe container de paginação
    const paginationContainer = document.querySelector('.swiper-pagination')
    expect(paginationContainer).toBeInTheDocument()
    
    // Verifica se existem bullets de paginação
    const paginationBullets = document.querySelectorAll('.swiper-pagination-bullet')
    expect(paginationBullets.length).toBeGreaterThan(0)
    
    // Verifica se pelo menos um bullet está ativo
    const activeBullet = document.querySelector('.swiper-pagination-bullet-active')
    expect(activeBullet).toBeInTheDocument()
  })

  it("prioritizes featured posts over recent posts", () => {
    const mixedPosts = [
      ...mockPosts.slice(0, 2), // 2 regular posts
      ...mockPostsWithFeatured.filter(({ node }) => node.frontmatter.featured), // 2 featured posts
    ]
    
    render(<FeaturedPosts posts={mixedPosts} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 2")).toBeInTheDocument()
    expect(screen.queryByText("Post 1")).not.toBeInTheDocument()
    expect(screen.queryByText("Post 2")).not.toBeInTheDocument()
  })
})
