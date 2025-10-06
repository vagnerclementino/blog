import React from "react"
import { render, screen } from "@testing-library/react"
import PostCarousel from "./postCarousel"
import { faHeart, faFire } from "@fortawesome/free-solid-svg-icons"

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
]

describe("PostCarousel", () => {
  it("renders regular posts carousel", () => {
    render(
      <PostCarousel 
        posts={mockPosts} 
        title="Últimos Posts"
        icon={faFire}
        count={3}
      />
    )
    
    expect(screen.getByText("Últimos Posts")).toBeInTheDocument()
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
  })

  it("renders featured posts carousel with badge", () => {
    render(
      <PostCarousel 
        posts={mockPostsWithFeatured} 
        title="Posts em Destaque"
        icon={faHeart}
        featured={true}
        badge="Destaque"
      />
    )
    
    expect(screen.getByText("Posts em Destaque")).toBeInTheDocument()
    expect(screen.getByText("Destaque")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
  })

  it("falls back to first 3 posts when no featured posts exist", () => {
    render(
      <PostCarousel 
        posts={mockPosts} 
        title="Posts em Destaque"
        featured={true}
      />
    )
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
  })

  it("displays pagination bullets", () => {
    const paginationContainer = document.querySelector('.swiper-pagination')
    expect(paginationContainer).toBeInTheDocument()
  })

  it("renders navigation buttons", () => {
    render(<PostCarousel posts={mockPosts} count={3} />)
    
    expect(screen.getByText("‹")).toBeInTheDocument()
    expect(screen.getByText("›")).toBeInTheDocument()
  })

  it("renders nothing when no posts provided", () => {
    const { container } = render(<PostCarousel posts={[]} />)
    
    expect(container.firstChild).toBeNull()
  })
})
