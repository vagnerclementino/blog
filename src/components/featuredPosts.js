import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import PostCard from "./postCard"

// Import Swiper styles
import 'swiper/css'

const FeaturedPosts = ({ posts }) => {
  const [swiper, setSwiper] = React.useState(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  
  // Tenta encontrar posts com featured: true, senão usa os 3 últimos
  let featuredPosts = posts.filter(({ node: post }) => post.frontmatter.featured)
  
  if (!featuredPosts.length) {
    featuredPosts = posts.slice(0, 3)
  }

  if (!featuredPosts.length) {
    return null
  }

  const handleSlideChange = (swiperInstance) => {
    setActiveIndex(swiperInstance.activeIndex)
  }

  const goToSlide = (index) => {
    swiper?.slideTo(index)
    setActiveIndex(index)
  }

  return (
    <Container>
      <Title>
        <FontAwesomeIcon icon={faHeart} /> Posts em Destaque
      </Title>
      <CarouselContainer>
        <PrevButton onClick={() => swiper?.slidePrev()}>
          ‹
        </PrevButton>
        <NextButton onClick={() => swiper?.slideNext()}>
          ›
        </NextButton>
        <StyledSwiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {featuredPosts.map(({ node: post }) => (
            <SwiperSlide key={post.fields.slug}>
              <PostCardWrapper>
                <PostCard post={post} />
                <FeaturedBadge>Destaque</FeaturedBadge>
              </PostCardWrapper>
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <CustomPagination>
          {featuredPosts.map((_, index) => (
            <PaginationBullet
              key={index}
              $active={index === activeIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </CustomPagination>
      </CarouselContainer>
    </Container>
  )
}

const Container = styled.section`
  margin: 3rem 0;
`

const Title = styled.h2`
  margin-bottom: 2rem;
  color: var(--textNormal);
  font-size: 1.5rem !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    color: #e74c3c; /* Vermelho vibrante para o coração */
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem !important;
    margin-bottom: 1.5rem;
  }
`

const CarouselContainer = styled.div`
  position: relative;
  padding: 0 60px;
  
  @media (max-width: 480px) {
    padding: 0 10px;
  }
`

const PrevButton = styled.button`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: 2px solid var(--textLink);
  border-radius: 50%;
  background: var(--bg);
  color: var(--textLink);
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--textLink);
    color: var(--bg);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    left: 5px;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 18px;
    left: -25px;
  }
`

const NextButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: 2px solid var(--textLink);
  border-radius: 50%;
  background: var(--bg);
  color: var(--textLink);
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--textLink);
    color: var(--bg);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    right: 5px;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 18px;
    right: -25px;
  }
`

const CustomPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 6px;
  padding: 5px;
  width: 100%;
  position: relative;
  z-index: 10;
`

const PaginationBullet = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$active ? '#007aff' : 'rgba(0, 0, 0, 0.2)'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  position: relative;
  opacity: ${props => props.$active ? '1' : '0.5'};
  
  &:hover {
    background: #007aff;
    opacity: 1;
    transform: scale(1.2);
  }
`

const StyledSwiper = styled(Swiper).withConfig({
  shouldForwardProp: (prop) => !['spaceBetween', 'slidesPerView', 'navigation', 'autoplay'].includes(prop),
})`
  padding-bottom: 50px;
  
  .swiper-slide {
    height: auto;
    display: flex;
    justify-content: center;
    
    > * {
      width: auto;
    }
  }
  
  .swiper-pagination {
    position: static !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-top: 20px !important;
    height: 20px !important;
  }
  
  .swiper-pagination-bullet {
    width: 12px !important;
    height: 12px !important;
    background: var(--textSecondary) !important;
    opacity: 1 !important;
    margin: 0 4px !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    display: inline-block !important;
    
    &.swiper-pagination-bullet-active {
      background: var(--textLink) !important;
    }
  }
`

const PostCardWrapper = styled.div`
  position: relative;
  height: 100%;
`

const FeaturedBadge = styled.span`
  position: absolute;
  top: -1px;
  right: 1rem;
  background: var(--textLink);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 8px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
`

export default FeaturedPosts
