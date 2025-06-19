import React from "react";
import { useNavigate } from "react-router-dom";
import Homestyles from "../styles/Home.module.css";
import Navstyles from "../styles/Nav.module.css"; // 오타 수정: Navtyles -> Navstyles
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
        <div className={Navstyles.Navdetail}>
          <div className={Navstyles.Navfirstline}>
            <p
              className={`${Navstyles.Clickhome} ${Navstyles.Clicknav}`}
              onClick={() => navigate("/Home")}
            >
              Home
            </p>
          </div>
          <div className={Navstyles.Navsecondline}>
            <p
              className={`${Navstyles.Clickbookgallery} ${Navstyles.Clicknav}`}
              onClick={() => navigate("/BookGallery")}
            >
              BookGallery
            </p>
          </div>
          <div className={Navstyles.Navthirdline}>
            <p
              className={`${Navstyles.Clickwrite} ${Navstyles.Clicknav}`}
              onClick={() => navigate("/selectbook")}
            >
              Write
            </p>
          </div>
          <div className={Navstyles.Navfourthline}>
            <p
              className={`${Navstyles.Clickmypage} ${Navstyles.Clicknav}`}
              onClick={() => navigate("/MyPage")}
            >
              MyPage
            </p>
          </div>
          <div className={Navstyles.Navfifthline}>
            <p
              className={`${Navstyles.ClickbookSearch} ${Navstyles.Clicknav}`}
              onClick={() => navigate("/booksearch", { state: { from: "nav" } })}
            >
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