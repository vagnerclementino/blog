import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PostCard from "./postCard"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const PostsList = ({ posts, title, icon, count, showAll = false, carousel = false, autoplay = false }) => {
  const displayPosts = showAll ? posts : posts.slice(0, count)

  if (!displayPosts.length) {
    return null
  }

  return (
    <Container>
      {title && (
        <Title>
          {icon && <FontAwesomeIcon icon={icon} />} {title}
        </Title>
      )}
      {carousel ? (
        <CarouselContainer>
          <StyledSwiper
            modules={[Navigation, Pagination, ...(autoplay ? [Autoplay] : [])]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={autoplay ? {
              delay: 5000,
              disableOnInteraction: false,
            } : false}
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
            {displayPosts.map(({ node: post }) => (
              <SwiperSlide key={post.fields.slug}>
                <PostCard post={post} />
              </SwiperSlide>
            ))}
          </StyledSwiper>
        </CarouselContainer>
      ) : (
        <PostsGrid>
          {displayPosts.map(({ node: post }) => (
            <PostCard key={post.fields.slug} post={post} />
          ))}
        </PostsGrid>
      )}
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
