import React from "react"
import styled from "styled-components"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import PostCard from "./postCard"

//Import Swiper styles
import 'swiper/css'

const PostCarousel = ({ 
  posts, 
  title, 
  icon, 
  count, 
  showAll = false, 
  autoplay = false,
  featured = false,
  badge = null
}) => {
  const [swiper, setSwiper] = React.useState(null)
  const [activeIndex, setActiveIndex] = React.useState(0)
  
  //Filtrar posts baseado no tipo
  let displayPosts
  if (featured) {
    //Para posts em destaque, filtrar por featured: true ou usar os primeiros 3
    displayPosts = posts.filter(({ node: post }) => post.frontmatter.featured)
    if (!displayPosts.length) {
      displayPosts = posts.slice(0, 3)
    }
  } else {
    //Para posts normais, usar count ou todos
    displayPosts = showAll ? posts : posts.slice(0, count)
  }

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
              {featured ? (
                <PostCardWrapper>
                  <PostCard post={post} />
                  {badge && <FeaturedBadge>{badge}</FeaturedBadge>}
                </PostCardWrapper>
              ) : (
                <PostCard post={post} />
              )}
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
    
    /* Cor específica para o ícone de coração */
    &[data-icon="heart"] {
      color: #e74c3c;
    }
    
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

const StyledSwiper = styled(Swiper).withConfig({
  shouldForwardProp: (prop) => !['spaceBetween', 'slidesPerView', 'autoplay'].includes(prop),
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

export default PostCarousel
