import React, { useState } from "react";
import Image from "next/image";
import styleSwiper from "./Lumiere003.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function LumiereSection003() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(1);

  // 재생/일시정지 토글 함수
  const toggleAutoplay = () => {
    if (swiper) {
      if (isPlaying) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 슬라이드 변경 시 이벤트 핸들러
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const slides = [
    {
      image: "/lumiere/lumiere003_slide001.jpg",
      alt: "Lumiere Slide 1",
      title: "자연스러운 광채",
      description: "자연광처럼 은은하게 빛나는 피부를 연출합니다",
    },
    {
      image: "/lumiere/lumiere003_slide002.jpg",
      alt: "Lumiere Slide 2",
      title: "완벽한 피부 표현",
      description: "당신만의 아름다움을 깨워줍니다",
    },
    {
      image: "/lumiere/lumiere003_slide003.jpg",
      alt: "Lumiere Slide 3",
      title: "감성적인 순간",
      description: "빛나는 모든 순간을 위한 메이크업",
    },
    {
      image: "/lumiere/lumiere003_slide004.jpg",
      alt: "Lumiere Slide 4",
      title: "내면의 빛",
      description: "당신의 아름다움을 더욱 빛나게 합니다",
    },
    {
      image: "/lumiere/lumiere003_slide005.jpg",
      alt: "Lumiere Slide 5",
      title: "특별한 장소를 위한",
      description: "어디서나 빛나는 당신의 매력",
    },
    {
      image: "/lumiere/lumiere003_slide006.jpg",
      alt: "Lumiere Slide 6",
      title: "아름다움의 시작",
      description: "LUMIERE와 함께하는 빛나는 순간들",
    },
  ];

  return (
    <div className={styleSwiper.multi_carousel_section}>
      <h2 className={styleSwiper.section_title}>당신의 빛나는 순간을 담다</h2>

      <div className={styleSwiper.multi_carousel_container}>
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={3}
          initialSlide={1}
          spaceBetween={20}
          centeredSlides={false}
          loop={true}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: `.${styleSwiper.multi_pagination}`,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
              centeredSlides: false,
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 15,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 20,
              centeredSlides: false,
            },
          }}
          className={styleSwiper.multi_swiper}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={styleSwiper.multi_slide}>
              <div
                className={`${styleSwiper.slide_inner} ${
                  activeIndex === index ? styleSwiper.slide_active : ""
                }`}
              >
                <div className={styleSwiper.slide_content}>
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
                <div className={styleSwiper.slide_image_wrapper}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill={true}
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                  />
                </div>
                <div className={styleSwiper.slide_number}>{index + 1}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 사용자 정의 페이지네이션 */}
        <div className={styleSwiper.pagination_container}>
          <div className={styleSwiper.multi_pagination}></div>
          <button
            className={styleSwiper.play_button}
            onClick={toggleAutoplay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <span className={styleSwiper.pause_icon}>
                <span></span>
                <span></span>
              </span>
            ) : (
              <span className={styleSwiper.play_icon}></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LumiereSection003;
