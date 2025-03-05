import React from "react";
import Image from "next/image";
import useHorizontalScroll from "./useHorizontalScroll";
import styles from "./Lumiere.module.scss";

const LumiereSection007 = () => {
  const { stickyRef, stickyParentRef, isVisible } = useHorizontalScroll();

  return (
    <div className={`${styles.lumiereSection} ${styles.whBG}`}>
      <div className={styles.contentWrapper}>
        <div className={styles.lumiereTextWrapper}>
          <div className={`${styles.title} ${styles.bkText}`}>
            당신만의 시그니처 컬러를 찾는 'LUMIERE 듀얼 립 블렌딩
          </div>
          <p className={styles.bkText}>
            LUMIERE의 'AI 립 블렌딩' 기능은 두 가지 다른 립스틱 컬러를 자유롭게
            믹스매치하여 나만의 특별한 립 컬러를 만들 수 있는 혁신적인
            서비스입니다. AI 아바타에 원하는 두 가지 립스틱을 선택하면
            실시간으로 블렌딩된 새로운 컬러를 미리 확인할 수 있습니다. 이를 통해
            고객은 수백 가지의 새로운 립 컬러를 가상으로 테스트해보고, 자신만의
            시그니처 컬러를 찾을 수 있습니다.
          </p>
          <Image
            style={{
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              marginTop: "32px",
            }}
            src="/lumiere/lumiere_mix.png"
            alt="Lumiere Logo"
            layout="responsive"
            width={1000}
            height={300}
          />
        </div>

        <div
          ref={stickyParentRef}
          className={styles.sticky_parent}
          style={{ zIndex: 1 }}
        >
          <div
            ref={stickyRef}
            className={`${styles.sticky} ${isVisible ? styles.visible : ""}`}
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}
          >
            <div className={styles.horizontal}>
              <div className={styles.lumiere002_image_wrapper}>
                <Image
                  className={styles.lumiere_phone}
                  src="/lumiere/lumiere007_01.jpg"
                  alt="Lumiere Logo"
                  width={430}
                  height={300}
                />
                <video
                  className={styles.lumiere_phone}
                  autoPlay
                  muted
                  loop
                  playsInline
                  width={430}
                  height={300}
                >
                  <source src="/lumiere/lumiere007_02.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumiereSection007;
