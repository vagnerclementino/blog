import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import PostCard from "./postCard"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const FeaturedPosts = ({ posts, count = 3 }) => {
  const featuredPosts = posts.slice(0, count)

  if (!featuredPosts.length) {
    return null
  }

  return (
    <Container>
      <Title>
        <FontAwesomeIcon icon={faHeart} /> Posts em Destaque
      </Title>
      <CarouselContainer>
        <StyledSwiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
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
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    color: #e74c3c; /* Vermelho vibrante para o coração */
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`

const CarouselContainer = styled.div`
  position: relative;
  padding: 0 50px; /* Espaço para os botões de navegação */
  
  .swiper-button-next,
  .swiper-button-prev {
    color: var(--textLink);
    background: var(--bg);
    border: 2px solid var(--textLink);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px; /* Centraliza verticalmente */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:after {
      font-size: 16px;
      font-weight: bold;
    }
    
    &:hover {
      background: var(--textLink);
      color: var(--bg);
      transform: scale(1.1);
    }
  }
  
  .swiper-button-next {
    right: 10px; /* Posiciona fora do card */
  }
  
  .swiper-button-prev {
    left: 10px; /* Posiciona fora do card */
  }
  
  .swiper-pagination-bullet {
    background: var(--textSecondary);
    
    &.swiper-pagination-bullet-active {
      background: var(--textLink);
    }
  }
  
  @media (max-width: 768px) {
    padding: 0 35px; /* Menos padding no mobile */
    
    .swiper-button-next,
    .swiper-button-prev {
      width: 35px;
      height: 35px;
      margin-top: -17.5px;
      
      &:after {
        font-size: 14px;
      }
    }
    
    .swiper-button-next {
      right: 5px;
    }
    
    .swiper-button-prev {
      left: 5px;
    }
  }
`

const StyledSwiper = styled(Swiper).withConfig({
  shouldForwardProp: (prop) => !['spaceBetween', 'slidesPerView', 'navigation', 'autoplay'].includes(prop),
})`
  padding-bottom: 40px;
  
  .swiper-slide {
    height: auto;
    display: flex;
    
    /* Garante que todos os cards tenham a mesma altura */
    > * {
      width: 100%;
      display: flex;
      flex-direction: column;
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
