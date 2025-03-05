import React from "react";
import Image from "next/image";
import useHorizontalScroll from "./useHorizontalScroll";
import styles from "./Lumiere.module.scss";

const LumiereSection005 = () => {
  const { stickyRef, stickyParentRef, isVisible } = useHorizontalScroll();

  return (
    <div className={styles.lumiereSection}>
      <div className={styles.lumiereTextWrapper}>
        <div className={styles.title}>
          당신만의 빛나는 순간을 AI 아바타로 만나보세요
        </div>
        <p>
          LUMIERE의 AI 뷰티 아바타는 고객의 셀피를 통해 개인 맞춤형 3D 아바타를
          생성하는 혁신적인 서비스입니다. 사용자의 실제 얼굴을 정교하게 구현하여
          LUMIERE 제품으로 실시간 가상 메이크업을 체험할 수 있으며, AI가 분석한
          개인 피부 상태에 따라 최적의 제품을 추천받을 수 있습니다. 또한 완성된
          메이크업 룩을 SNS에 바로 공유하고 다른 사용자들과 뷰티 팁을 나눌 수
          있어, 더욱 즐거운 뷰티 경험을 제공합니다.
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
                src="/lumiere/lumiere005_01.jpg"
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
                <source src="/lumiere/lumiere_avatar.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumiereSection005;
