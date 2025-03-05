"use client";

import styles from "./loading.module.scss";
import dynamic from "next/dynamic";
import lottieAnimation from "../../public/lumiere/lumiere_lottie.json";

// Lottie 컴포넌트를 클라이언트 사이드에서만 로드하도록 동적으로 임포트
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
  loading: () => <div style={{ width: "150px", height: "150px" }}></div>, // 로딩 중에 표시될 컴포넌트
});

export default function LoadingSpinner() {
  return (
    <div className={styles.loading}>
      <div className="text-center">
        <div className="mx-auto" style={{ width: "150px", height: "150px" }}>
          <Lottie animationData={lottieAnimation} loop={true} />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
