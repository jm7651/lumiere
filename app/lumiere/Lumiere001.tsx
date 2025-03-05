import React from "react";
import Image from "next/image";
import styles from "./Lumiere.module.scss";

const LumiereSection001 = () => {
  return (
    <section style={{ overflow: "hidden" }} className={styles.main_bg}>
      <div className="inner relative w-full max-w-4xl mx-auto px-4  flex flex-col items-center">
        <div className={styles.lumiere_logo}>
          <Image
            src="/lumiere/lumiere_logo.svg"
            alt="Lumiere Logo"
            layout="responsive"
            width={1000}
            height={300}
          />
        </div>
        <div className={styles.lumiere001_main}>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/lumiere/lumiere_main.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
};

export default LumiereSection001;
