import React from "react";
import Image from "next/image";
import useHorizontalScroll from "./useHorizontalScroll";
import styles from "./Lumiere.module.scss";

const LumiereSection002 = () => {
  const { stickyRef, stickyParentRef, isVisible } = useHorizontalScroll();

  return (
    <div className={`${styles.lumiereSection} ${styles.bkBG}`}>
      <div className={styles.contentWrapper}>
        <div className={styles.lumiereTextWrapper}>
          <Image
            style={{
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            src="/lumiere/lumiere_light.png"
            alt="Lumiere Logo"
            layout="responsive"
            width={1000}
            height={300}
          />
          <div className={`${styles.title} ${styles.whText}`}>Concept</div>
          <p className={styles.whText}>
            LUMIERE는 프랑스어로 '빛'을 의미하는 단어입니다 모든 사람이 가지고
            있는 고유한 아름다움, 즉 '내면의 빛'을 믿습니다. 과도한 메이크업이나
            인위적인 변화가 아닌, 자연스러운 피부 본연의 건강한 광채를 끌어내는
            것이 우리의 철학입니다.
          </p>
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
                  src="/lumiere/lumiere002_01.png"
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
                  <source src="/lumiere/lumiere002.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumiereSection002;
