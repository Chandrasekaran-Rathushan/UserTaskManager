"use client";

import React, { useEffect } from "react";
import { gsap, Linear } from "gsap";
import styles from "./not-found.module.css";

const NotFound: React.FC = () => {
  useEffect(() => {
    localStorage.setItem("currentPage ", window.location.pathname);

    const t1 = gsap.timeline();
    const t2 = gsap.timeline();
    const t3 = gsap.timeline();

    t1.to(`.${styles.cog1}`, {
      transformOrigin: "50% 50%",
      rotation: "+=360",
      repeat: -1,
      ease: Linear.easeNone,
      duration: 8,
    });

    t2.to(`.${styles.cog2}`, {
      transformOrigin: "50% 50%",
      rotation: "-=360",
      repeat: -1,
      ease: Linear.easeNone,
      duration: 8,
    });

    t3.fromTo(
      `.${styles.wrongPara}`,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1,
        stagger: {
          repeat: -1,
          yoyo: true,
        },
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.firstFour}>4</h1>
      </div>
      <div className={styles.conRow}>
        <div className={styles.cogWheel1}>
          <div className={styles.cog1}>
            <div className={styles.top}></div>
            <div className={styles.down}></div>
            <div className={styles.leftTop}></div>
            <div className={styles.leftDown}></div>
            <div className={styles.rightTop}></div>
            <div className={styles.rightDown}></div>
            <div className={styles.left}></div>
            <div className={styles.right}></div>
          </div>
        </div>

        <div className={styles.cogWheel2}>
          <div className={styles.cog2}>
            <div className={styles.top}></div>
            <div className={styles.down}></div>
            <div className={styles.leftTop}></div>
            <div className={styles.leftDown}></div>
            <div className={styles.rightTop}></div>
            <div className={styles.rightDown}></div>
            <div className={styles.left}></div>
            <div className={styles.right}></div>
          </div>
        </div>
      </div>
      <div>
        <h1 className={styles.secondFour}>4</h1>
      </div>

      <p className={styles.wrongPara}>Uh Oh! Page not found!</p>
    </div>
  );
};

export default NotFound;
