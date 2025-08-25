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
  Swiper: ({ children, ...props }) => (
    <div data-testid="swiper" {...props}>
      {children}
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
        title: "Featured Post 1",
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
        title: "Featured Post 2", 
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
        title: "Featured Post 3",
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
        title: "Regular Post 4",
        date: "04/01/2024",
        description: "Description for post 4",
      },
      excerpt: "Excerpt for post 4",
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

  it("displays only first 3 posts as featured in carousel", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 2")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 3")).toBeInTheDocument()
    expect(screen.queryByText("Regular Post 4")).not.toBeInTheDocument()
  })

  it("respects custom count prop", () => {
    render(<FeaturedPosts posts={mockPosts} count={2} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("Featured Post 2")).toBeInTheDocument()
    expect(screen.queryByText("Featured Post 3")).not.toBeInTheDocument()
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

  it("renders post details correctly using PostCard", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    // PostCard should render the post details
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
    expect(screen.getByText("Featured Post 1")).toBeInTheDocument()
    expect(screen.getByText("01/01/2024")).toBeInTheDocument()
  })

  it("renders nothing when no posts provided", () => {
    const { container } = render(<FeaturedPosts posts={[]} />)
    
    expect(container.firstChild).toBeNull()
  })

  it("uses PostCard component for consistent styling", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    // Verify that PostCard components are rendered
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
  })

  it("has standardized 'Ler mais' links for each featured post", () => {
    render(<FeaturedPosts posts={mockPosts} />)
    
    const readMoreLinks = screen.getAllByText("Ler mais")
    expect(readMoreLinks).toHaveLength(3)
  })
})
