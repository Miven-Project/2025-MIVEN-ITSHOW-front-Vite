import React from "react";
import { useNavigate } from "react-router-dom";
import Homestyles from "../styles/Home.module.css";
import HomeImgContainer from "../assets/images/HomeImgContainer.png";

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
          <p className={Homestyles.Clicklogo}>LOGO</p>
        </div>
        <div className={Homestyles.Navdetail}>
          <div className={Homestyles.Navfirstline}>
            <p
              className={`${Homestyles.Clickhome} ${Homestyles.Clicknav}`}
              onClick={() => navigate("/Home")}
            >
              Home
            </p>
            <p
              className={`${Homestyles.Clickbookgallery} ${Homestyles.Clicknav}`}
              onClick={() => navigate("/BookGallery")}
            >
              BookGallery
            </p>
          </div>
          <div className={Homestyles.Navsecondline}>
            <p
              className={`${Homestyles.Clickwrite} ${Homestyles.Clicknav}`}
              onClick={() => navigate("/booksearch")}
            >
              Write
            </p>
            <p
              className={`${Homestyles.Clickmypage} ${Homestyles.Clicknav}`}
              onClick={() => navigate("/MyPage")}
            >
              MyPage
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
