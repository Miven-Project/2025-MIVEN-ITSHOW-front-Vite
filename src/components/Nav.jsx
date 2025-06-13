import React from "react";
import styles from "../styles/Nav.module.css";
import { useCoverColor } from "../contexts/CoverColorContext";

export default function Nav({ showBackGradient = true }) {
  const { coverColor } = useCoverColor();

  return (
    <div>
      <div
        className={styles.Gradation}
        style={showBackGradient ? {
          background: `linear-gradient(180deg, ${coverColor} 0%, #fff 100%)`,
        } : null}
      ></div>
      <div className={styles.Allnavcontainer}>
        <div className={styles.Logo}>
          <p className={styles.Clicklogo}>LOGO</p>
        </div>
        <div className={styles.Navdetail}>
          <div className={styles.Navfirstline}>
            <p className={`${styles.Clickhome} ${styles.Clicknav}`}>Home</p>
            <p className={`${styles.Clickbookgallery} ${styles.Clicknav}`}>
              Book Gallery
              book
            </p>
          </div>
          <div className={styles.Navsecondline}>
            <p className={`${styles.Clickwrite} ${styles.Clicknav}`}>Write</p>
            <p className={`${styles.Clickmypage} ${styles.Clicknav}`}>
              My Page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
