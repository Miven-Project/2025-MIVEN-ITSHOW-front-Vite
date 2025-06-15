import { Nav } from '../pages/Home.jsx';
import "../styles/BookGallery.css";
import React, { useEffect, useState, useRef } from "react";
import searchIcon from '/assets/images/search-icon.png';

function BookGallery() {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const apiBaseUrl = "http://3.38.185.232:8080";

    fetch(`${apiBaseUrl}/api/gallery/mylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc0OTk2MjEwNiwiZXhwIjoxNzUwODI2MTA2fQ.Zr2Chd6u2YpoJaKB6jKIq_Ska_CTpJlQ57QFtcbw_SE",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.json();
      })
      .then(async (json) => {
        const books = json.data?.books || [];

        const detailedBooks = await Promise.all(
          books.map(async (book) => {
            try {
              const res = await fetch(`${apiBaseUrl}/api/gallery/${book.bookId}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc0OTk2MjEwNiwiZXhwIjoxNzUwODI2MTA2fQ.Zr2Chd6u2YpoJaKB6jKIq_Ska_CTpJlQ57QFtcbw_SE",
                },
              });
              if (!res.ok) return { ...book, quote: "" };
              const detailJson = await res.json();
              return { ...book, quote: detailJson.data?.quote || "" };
            } catch {
              return { ...book, quote: "" };
            }
          })
        );

        setBookData(detailedBooks);
        setFilteredData(detailedBooks);
      })
      .catch((err) => console.error("❌ 데이터 불러오기 실패:", err));
  }, []);

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
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="hover-overlay">
                <p className="book-quote">{book.quote}</p>
                <button className="view-button">View</button>
              </div>
            </div>
            <p className="book-title">{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryMark() {
  return (
    <div className="GalleryMark">
      <img className="GalleryMark-1" src="/assets/images/Gallery-1.png" alt="Gallery-1" />
      <img className="GalleryMark-2" src="/assets/images/Gallery.png" alt="Gallery-2" />
    </div>
  );
}

export default BookGallery;
