import styles from "./loading.module.scss";
import Lottie from "lottie-react";
import lottieAnimation from "../../public/lumiere/lumiere_lottie.json";

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
