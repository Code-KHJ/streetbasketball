import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const BannerSlider = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay, A11y]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      loop={true}
    >
      <SwiperSlide>
        <img
          src="/images/banner_1.png"
          alt="banner"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        ></img>
      </SwiperSlide>
      <SwiperSlide>
        <img
          src="/images/banner_2.png"
          alt="banner"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() =>
            window.open('https://open.kakao.com/o/gIvCS6pg', '_blank')
          }
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default BannerSlider;
