import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Nav.module.css";
import { useCoverColor } from "../contexts/CoverColorContext";
import LeafInLogo from "../assets/images/LeafInLogo.svg"
import LeafInLogoWhiteVer from "../assets/images/LeafInLogoWhiteVer.svg"

export default function Nav({ showBackGradient = true }) {
  const { coverColor } = useCoverColor();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <div
        className={styles.Gradation}
        style={
          showBackGradient
            ? {
              background: `linear-gradient(180deg, ${coverColor} 0%, #fff 100%)`,
            }
            : null
        }
      ></div>
      <div className={`${styles.Allnavcontainer} ${showBackGradient ? styles.gradientNav : ''}`}>
        <p
          className={styles.Clicklogo}
          onClick={() => handleNavigation("/home")}
        >
          <img
            src={showBackGradient ? LeafInLogoWhiteVer : LeafInLogo}
            alt=""
            className={styles.logo}
          />
        </p>

        <div className={styles.Navdetail}>
          <div className={styles.Navfirstline}>
            <p
              className={`${styles.Clickhome} ${styles.Clicknav}`}
              onClick={() => handleNavigation("/home")}
              style={{ cursor: "pointer" }}
            >
              Home
            </p>
          </div>
          <div className={styles.Navsecondline}>
            <p
              className={`${styles.Clickbookgallery} ${styles.Clicknav}`}
              onClick={() => handleNavigation("/bookgallery")}
              style={{ cursor: "pointer" }}
            >
              Book Gallery
            </p>
          </div>
          <div className={styles.Navthirdline}>
            <p
              className={`${styles.Clickwrite} ${styles.Clicknav}`}
              onClick={() => handleNavigation("/selectbook")}
              style={{ cursor: "pointer" }}
            >
              Write
            </p>
          </div>

          <div className={styles.Navfourthline}>
            <p
              className={`${styles.Clickmypage} ${styles.Clicknav}`}
              onClick={() => handleNavigation("/mypage")}
              style={{ cursor: "pointer" }}
            >
              My Page
            </p>
          </div>
          <div className={styles.Navfifthline}>
            <p
              className={`${styles.ClickbookSearch} ${styles.Clicknav}`}
              onClick={() => navigate("/booksearch", { state: { from: "nav" } })}>
              Book Search
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
