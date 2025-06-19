import React from "react";
import { useNavigate } from "react-router-dom";
import Homestyles from "../styles/Home.module.css";
import Navtyles from "../styles/Nav.module.css";
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
        <div className={Navtyles.Navdetail}>
          <div className={Navtyles.Navfirstline}>
            <p
              className={`${Navtyles.Clickhome} ${Navtyles.Clicknav}`}
              onClick={() => navigate("/Home")}
              style={{ cursor: "pointer" }}
            >
              Home
            </p>
          </div>
          <div className={Navtyles.Navsecondline}>
            <p
              className={`${Navtyles.Clickbookgallery} ${Navtyles.Clicknav}`}
              onClick={() => navigate("/BookGallery")}
              style={{ cursor: "pointer" }}
            >
              BookGallery
            </p>
          </div>
          <div className={Navtyles.Navthirdline}>
            <p
              className={`${Navtyles.Clickwrite} ${Navtyles.Clicknav}`}
              onClick={() => navigate("/selectbook")}
              style={{ cursor: "pointer" }}
            >
              Write
            </p>
          </div>
          <div className={Navtyles.Navfourthline}>
            <p
              className={`${Navtyles.Clickmypage} ${Navtyles.Clicknav}`}
              onClick={() => navigate("/MyPage")}
              style={{ cursor: "pointer" }}
            >
              MyPage
            </p>
          </div>
          <div className={Navtyles.Navfifthline}>
            <p
              className={`${Navtyles.ClickbookSearch} ${Navtyles.Clicknav}`}
              onClick={() => navigate("/booksearch", { state: { from: "nav" } })}
              style={{ cursor: "pointer" }}
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
