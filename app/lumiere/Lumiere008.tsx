import React from "react";
import styles from "./Lumiere.module.scss";

function LumiereSection008() {
  return (
    <div>
      <div className={styles.lumiereSection008}>
        <p>&apos;LUMIERE&apos;를 소개합니다</p>{" "}
        <video
          className={styles.lumiere_phone}
          autoPlay
          muted
          loop
          playsInline
          width={430}
          height={300}
        >
          <source src="/lumiere/final.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export default LumiereSection008;
