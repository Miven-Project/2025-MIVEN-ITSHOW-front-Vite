import React from "react";
import { useNavigate } from "react-router-dom";
import Homestyles from "../styles/Home.module.css";
import styles from "../styles/Nav.module.css"; // 오타 수정: Navtyles -> Navstyles
import HomeImgContainer from "../assets/images/HomeImgContainer.png";
import LeafInLogo from "../assets/images/LeafInLogo.svg"

function Home() {
  return (
    <div>
      <Nav />
      <SearchBar />
      <div className={Homestyles.HomeImgContainer}>
        <img
          src={HomeImgContainer}
          alt="HomeImgContainer"
          className={Homestyles.HomeImg}
        />
      </div>
    </div>
  );
}

export function Nav() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={Homestyles.Gradation}></div>
      <div className={Homestyles.Allnavcontainer}>
        <div className={Homestyles.Logo}>
          <img
            src={LeafInLogo}
            alt="LeafIn Logo"
            className={Homestyles.logo}
            onClick={() => navigate("/Home")}
            style={{ cursor: 'pointer' }}
          />
        </div>
        
                <div className={styles.Navdetail}>
                  <div className={styles.Navfirstline}>
                    <p
                      className={`${styles.Clickhome} ${styles.Clicknav}`}
                      onClick={() => navigate("/home")}
                      style={{ cursor: "pointer" }}
                    >
                      Home
                    </p>
                  </div>
                  <div className={styles.Navsecondline}>
                    <p
                      className={`${styles.Clickbookgallery} ${styles.Clicknav}`}
                      onClick={() => navigate("/bookgallery")}
                      style={{ cursor: "pointer" }}
                    >
                      Book Gallery
                    </p>
                  </div>
                  <div className={styles.Navthirdline}>
                    <p
                      className={`${styles.Clickwrite} ${styles.Clicknav}`}
                      onClick={() => navigate("/selectbook")}
                      style={{ cursor: "pointer" }}
                    >
                      Write
                    </p>
                  </div>
        
                  <div className={styles.Navfourthline}>
                    <p
                      className={`${styles.Clickmypage} ${styles.Clicknav}`}
                      onClick={() => navigate("/mypage")}
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

function SearchBar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/BookGallery");
  };

  return (
    <div className={Homestyles.SearchBar} onClick={handleClick}>
      <input
        type="text"
        className={Homestyles.search}
        placeholder="Search..."
        readOnly
      />
    </div>
  );
}

export default Home;