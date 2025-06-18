import { Nav } from '../pages/Home.jsx';
import "../styles/BookGallery.css";
import React, { useState, useRef, useEffect } from "react";
import searchIcon from '/assets/images/search-icon.png';
import testData from "../data/TestData.json";

function BookGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  //JSON 데이터로 초기 설정
  const [filteredData] = useState(testData);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // 검색 필터링
  const filteredBooks = filteredData.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <GalleryMark />

      <div className="search-bar-section">
        <div className="search-input-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="책 제목을 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="book-gallery-container">
        {filteredBooks.map((book, index) => (

          <div className="book-card" key={index}>
            <div className="book-cover-wrapper">
              <p className="book-title">{book.title}</p>
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="hover-overlay">
                <p className="book-quote">{book.quote}</p>
                <button className="view-button">View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 갤러리 마크 이미지
function GalleryMark() {
  return (
    <div className="GalleryMark">
      <img className="GalleryMark-1" src="/assets/images/Gallery-1.png" alt="Gallery-1" />
      <img className="GalleryMark-2" src="/assets/images/Gallery.png" alt="Gallery-2" />
    </div>
  );
}

export default BookGallery;
