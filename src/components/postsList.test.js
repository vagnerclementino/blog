import React from "react"
import { render, screen } from "@testing-library/react"
import PostsList from "./postsList"
import { faFire } from "@fortawesome/free-solid-svg-icons"

jest.mock("./postCard", () => {
  return function MockPostCard({ post }) {
    return (
      <div data-testid="post-card">
        <h3>{post.frontmatter.title}</h3>
        <p>{post.frontmatter.date}</p>
      </div>
    )
  }
})

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon, ...props }) => (
    <i data-testid="font-awesome-icon" data-icon={icon?.iconName || icon} {...props} />
  ),
}))

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
        title: "Post 1",
        date: "01/01/2024",
        description: "Description 1"
      },
      excerpt: "Excerpt 1"
    }
  },
  {
    node: {
      fields: { slug: "/post-2/" },
      frontmatter: {
        title: "Post 2",
        date: "02/01/2024",
        description: "Description 2"
      },
      excerpt: "Excerpt 2"
    }
  },
  {
    node: {
      fields: { slug: "/post-3/" },
      frontmatter: {
        title: "Post 3",
        date: "03/01/2024",
        description: "Description 3"
      },
      excerpt: "Excerpt 3"
    }
  },
  {
    node: {
      fields: { slug: "/post-4/" },
      frontmatter: {
        title: "Post 4",
        date: "04/01/2024",
        description: "Description 4"
      },
      excerpt: "Excerpt 4"
    }
  }
]

describe("PostsList", () => {
  it("renders posts list with title", () => {
    render(<PostsList posts={mockPosts} title="Test Posts" count={2} />)
    
    expect(screen.getByText("Test Posts")).toBeInTheDocument()
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
  })

  it("renders posts list without title", () => {
    render(<PostsList posts={mockPosts} count={2} />)
    
    // Check that there's no section title (h2), but posts can have their own h3 titles
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument()
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
  })

  it("limits posts based on count prop", () => {
    render(<PostsList posts={mockPosts} count={3} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(3)
  })

  it("shows all posts when showAll is true", () => {
    render(<PostsList posts={mockPosts} showAll={true} />)
    
    expect(screen.getAllByTestId("post-card")).toHaveLength(4)
  })

  it("renders nothing when no posts provided", () => {
    const { container } = render(<PostsList posts={[]} count={3} />)
    
    expect(container.firstChild).toBeNull()
  })

  it("renders correct post titles", () => {
    render(<PostsList posts={mockPosts} count={2} />)
    
    expect(screen.getByText("Post 1")).toBeInTheDocument()
    expect(screen.getByText("Post 2")).toBeInTheDocument()
    expect(screen.queryByText("Post 3")).not.toBeInTheDocument()
  })

  it("handles undefined count gracefully", () => {
    render(<PostsList posts={mockPosts} />)
    
    // Should render all posts when count is undefined
    expect(screen.getAllByTestId("post-card")).toHaveLength(4)
  })

  it("renders as grid when carousel is false", () => {
    render(<PostsList posts={mockPosts} count={2} carousel={false} />)
    
    expect(screen.queryByTestId("swiper")).not.toBeInTheDocument()
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
  })

  it("renders as carousel when carousel is true", () => {
    render(<PostsList posts={mockPosts} count={2} carousel={true} />)
    
    expect(screen.getByTestId("swiper")).toBeInTheDocument()
    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2)
    expect(screen.getAllByTestId("post-card")).toHaveLength(2)
  })

  it("supports autoplay in carousel mode", () => {
    render(<PostsList posts={mockPosts} count={2} carousel={true} autoplay={true} />)
    
    expect(screen.getByTestId("swiper")).toBeInTheDocument()
    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2)
  })

  it("renders icon when provided", () => {
    render(<PostsList posts={mockPosts} title="Test Title" icon={faFire} count={2} />)
    
    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByTestId("font-awesome-icon")).toBeInTheDocument()
    expect(screen.getByTestId("font-awesome-icon")).toHaveAttribute("data-icon", "fire")
  })

  it("renders title without icon when icon is not provided", () => {
    render(<PostsList posts={mockPosts} title="Test Title" count={2} />)
    
    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.queryByTestId("font-awesome-icon")).not.toBeInTheDocument()
  })
})
