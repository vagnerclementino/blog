import React from 'react'

const SwiperComponent = React.forwardRef(({ children, spaceBetween, slidesPerView, navigation, pagination, autoplay, breakpoints, modules, ...props }, ref) => (
  <div data-testid="swiper" ref={ref} {...props}>
    {children}
  </div>
))

SwiperComponent.displayName = 'Swiper'

export const Swiper = SwiperComponent

export const SwiperSlide = ({ children, ...props }) => (
  <div data-testid="swiper-slide" {...props}>
    {children}
  </div>
)

export const Navigation = 'Navigation'
export const Pagination = 'Pagination'
export const Autoplay = 'Autoplay'
