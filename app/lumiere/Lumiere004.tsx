import React from "react";
import styles from "./Lumiere.module.scss";

const LumiereSection001 = () => {
  return (
    <section style={{ overflow: "hidden" }} className={styles.main_bg}>
      <div className={styles.lumiere001_main} style={{ position: "relative" }}>
        <div
          className={styles.lumiere004_title}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: "100",
            fontSize: "clamp(4rem, -1.5rem + 8vw, 8rem)",
            color: "#fff",
            width: "100%",
            padding: "20px",
            fontWeight: "700",
          }}
        >
          The moment your inner beauty shines
        </div>
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/lumiere/lumiere004.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
};

export default LumiereSection001;
