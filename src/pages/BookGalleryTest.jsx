import { Nav } from '../pages/Home.jsx';
import styles from "../styles/BookGallery.module.css";
import React, { useState, useRef, useEffect } from "react";
import searchIcon from '/assets/images/search-icon.png';
import testData from "../data/TestData.json";

function BookGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // JSON 데이터로 초기 설정
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

      <div className={styles["search-bar-section"]}>
        <div className={styles["search-input-container"]}>
          <img src={searchIcon} alt="Search" className={styles["search-icon"]} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="책 제목을 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles["book-search-input"]}
          />
        </div>
      </div>

      <div className={styles["book-gallery-container"]}>
        {filteredBooks.map((book, index) => (
          <div className={styles["book-card"]} key={index}>
            <div className={styles["book-cover-wrapper"]}>
              <p className={styles["book-title"]}>{book.title}</p>
              <img src={book.cover} alt={book.title} className={styles["book-cover"]} />
              <div className={styles["hover-overlay"]}>
                <p className={styles["book-quote"]}>{book.quote}</p>
                <button className={styles["view-button"]}>View</button>
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
    <div className={styles.GalleryMark}>
      <img className={styles["GalleryMark-1"]} src="/assets/images/Gallery-1.png" alt="Gallery-1" />
      <img className={styles["GalleryMark-2"]} src="/assets/images/Gallery.png" alt="Gallery-2" />
    </div>
  );
}

export default BookGallery;
