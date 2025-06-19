import React from "react";
import { useNavigate } from "react-router-dom";
import Homestyles from "../styles/Home.module.css";
import NavStyles from "../styles/Nav.module.css";
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
        {/* <div className={Homestyles.Logo}> */}
        <img src={LeafInLogo} alt="" className={Homestyles.logo} />
        {/* </div> */}
        <div className={Homestyles.Navdetail}>
          <div className={Homestyles.Navfirstline}>
            <p
              className={`${NavStyles.Clickhome} ${NavStyles.Clicknav}`}
              onClick={() => navigate("/Home")}
            >
              Home
            </p>
            <p
              className={`${NavStyles.Clickbookgallery} ${NavStyles.Clicknav}`}
              onClick={() => navigate("/BookGallery")}
            >
              BookGallery
            </p>
          </div>
          <div className={NavStyles.Navsecondline}>
            <p
              className={`${NavStyles.Clickwrite} ${NavStyles.Clicknav}`}
              onClick={() => navigate("/selectbook")}
            >
              Write
            </p>
            <p
              className={`${NavStyles.Clickmypage} ${NavStyles.Clicknav}`}
              onClick={() => navigate("/MyPage")}
            >
              MyPage
            </p>
          </div>
          <p
            className={`${NavStyles.ClickbookSearch} ${NavStyles.Clicknav}`}
            onClick={() => navigate("/booksearch", { state: { from: "nav" } })}>
            Book Search
          </p>

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
