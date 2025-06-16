import { Nav } from "../pages/Home.jsx";
import "../styles/BookGallery.css";
import React, { useEffect, useState, useRef } from "react";
import searchIcon from "/assets/images/search-icon.png";

function BookGallery() {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState({}); // bookId를 key로 하는 quote 저장소
  const [loadingQuotes, setLoadingQuotes] = useState({}); // 로딩 상태 관리
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const apiBaseUrl = "http://3.38.185.232:8080";
    fetch(`${apiBaseUrl}/api/gallery/mylist`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc1MDA1MDE0NiwiZXhwIjoxNzUwOTE0MTQ2fQ.FhtjUlih_FPC6kcKdgkdD-23h6GJvrAu38tqW5VuZS0",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 응답 실패");
        return res.json();
      })
      .then((json) => {
        const books = json.data?.books || [];
        console.log("📖 Book 객체 구조 확인:", books[0]); // 구조 확인용
        console.log("📖 모든 속성:", Object.keys(books[0] || {})); // 속성명 확인용
        setBookData(books);
        setFilteredData(books);
      })
      .catch((err) => console.error("❌ 데이터 불러오기 실패:", err));
  }, []);

  // hover 시 quote 가져오기
  const fetchQuote = async (bookId, gNo) => {
    // 이미 로딩 중이거나 quote가 있으면 반환
    if (loadingQuotes[bookId] || quotes[bookId]) {
      return;
    }

    setLoadingQuotes((prev) => ({ ...prev, [bookId]: true }));

    const apiBaseUrl = "http://3.38.185.232:8080";
    try {
      const res = await fetch(`${apiBaseUrl}/api/gallery/detail/${gNo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc1MDA1MDE0NiwiZXhwIjoxNzUwOTE0MTQ2fQ.FhtjUlih_FPC6kcKdgkdD-23h6GJvrAu38tqW5VuZS0",
        },
      });

      if (res.ok) {
        const detailJson = await res.json();
        const quote = detailJson.data?.quote || "";
        setQuotes((prev) => ({ ...prev, [bookId]: quote }));
      } else {
        console.error(`❌ Quote API 에러 (${res.status}):`, res.statusText);
        setQuotes((prev) => ({
          ...prev,
          [bookId]: "명언을 불러올 수 없습니다",
        }));
      }
    } catch (error) {
      console.error("❌ Quote 불러오기 실패:", error);
      setQuotes((prev) => ({ ...prev, [bookId]: "명언을 불러올 수 없습니다" }));
    } finally {
      setLoadingQuotes((prev) => ({ ...prev, [bookId]: false }));
    }
  };

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
            <div
              className="book-cover-wrapper"
              onMouseEnter={() => fetchQuote(book.bookId, book.bookId)} // 임시로 bookId 사용
            >
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="hover-overlay">
                <p className="book-quote">
                  {loadingQuotes[book.bookId]
                    ? "명언을 불러오는 중..."
                    : quotes[book.bookId] || "마우스를 올려 명언을 확인하세요"}
                </p>
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
      <img
        className="GalleryMark-1"
        src="/assets/images/Gallery-1.png"
        alt="Gallery-1"
      />
      <img
        className="GalleryMark-2"
        src="/assets/images/Gallery.png"
        alt="Gallery-2"
      />
    </div>
  );
}

export default BookGallery;
