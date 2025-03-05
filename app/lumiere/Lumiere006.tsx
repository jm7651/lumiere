import React from "react";
import Image from "next/image";
import styleSwiper from "./Lumiere003.module.scss";
import styles from "./Lumiere.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function LumiereSection006() {
  return (
    <div className={`${styleSwiper.lumiere003} ${styles.bkBG}`}>
      <div className={styleSwiper.lumiere003Wrapper}>
        <div className={styles.lumiereTextWrapper}>
          <div className={`${styles.title} ${styles.whText}`}>
            어디서나 완벽한 LUMIERE&apos;s 스마트 라이팅 시뮬레이션
          </div>
          <p className={styles.whText}>
            LUMIERE의 스마트 라이팅 시뮬레이션은 다양한 조명 환경에서 메이크업이
            어떻게 보이는지 미리 확인할 수 있는 획기적인 기능입니다. AI 아바타에
            적용된 메이크업을 스튜디오, 자연광, 카페, 거리등 다양한 환경에서
            시뮬레이션해볼 수 있어, 어떤 상황에서도 완벽한 메이크업을 연출할 수
            있도록 도와줍니다. 이를 통해 고객은 실제 구매 전에 다양한 상황에서의
            메이크업 효과를 미리 체험할 수 있습니다
          </p>
        </div>
        <div className={styles.lumiere003_container}>
          <Swiper
            className={`${styles.swiper} ${styleSwiper.lumiere003_slide}`}
            modules={[Autoplay]}
            slidesPerView={2.5}
            spaceBetween={20}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
            }}
          >
            <SwiperSlide>
              <Image
                src="/lumiere/lumiere006_slide001.jpg"
                alt="Lumiere Slide"
                width={800}
                height={600}
                priority
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/lumiere/lumiere006_slide002.jpg"
                alt="Lumiere Slide"
                width={800}
                height={600}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/lumiere/lumiere006_slide003.jpg"
                alt="Lumiere Slide"
                width={800}
                height={600}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Image
                src="/lumiere/lumiere006_slide004.jpg"
                alt="Lumiere Slide"
                width={800}
                height={600}
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default LumiereSection006;
