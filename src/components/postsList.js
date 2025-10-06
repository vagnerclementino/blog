import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PostCard from "./postCard"

// Import Swiper styles
import 'swiper/css'

const PostsList = ({ posts, title, icon, count, showAll = false, autoplay = false }) => {
  const [swiper, setSwiper] = React.useState(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const displayPosts = showAll ? posts : posts.slice(0, count)

  if (!displayPosts.length) {
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
      {title && (
        <Title>
          {icon && <FontAwesomeIcon icon={icon} />} {title}
        </Title>
      )}
      <CarouselContainer>
        <PrevButton onClick={() => swiper?.slidePrev()}>
          ‹
        </PrevButton>
        <NextButton onClick={() => swiper?.slideNext()}>
          ›
        </NextButton>
        <StyledSwiper
          modules={[...(autoplay ? [Autoplay] : [])]}
          spaceBetween={30}
          slidesPerView={1}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          autoplay={autoplay ? {
            delay: 5000,
            disableOnInteraction: false,
          } : false}
          breakpoints={{
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {displayPosts.map(({ node: post }) => (
            <SwiperSlide key={post.fields.slug}>
              <PostCard post={post} />
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <CustomPagination>
          {displayPosts.map((_, index) => (
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
    color: var(--textLink);
    
    /* Cor específica para o ícone de fogo */
    &[data-icon="fire"] {
      color: #ff6b35;
      background: linear-gradient(45deg, #ff6b35, #f7931e, #ffcc02);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 3px rgba(255, 107, 53, 0.3));
    }
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

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: 1fr; /* Garante que todas as linhas tenham a mesma altura */
  gap: 2rem;
  align-items: stretch; /* Estica os itens para preencher a altura */
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`

export default PostsList
