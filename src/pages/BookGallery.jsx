import { Nav } from "../pages/Home.jsx";
import "../styles/BookGallery.css";
import React, { useEffect, useState, useRef } from "react";
import searchIcon from "/assets/images/search-icon.png";

function BookGallery() {
  const [bookData, setBookData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookDetails, setBookDetails] = useState({}); // bookId를 key로 하는 상세 정보 저장소
  const [loadingDetails, setLoadingDetails] = useState({}); // 로딩 상태 관리
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);

  const apiBaseUrl = "http://3.38.185.232:8080";

  // 🔥 동적 토큰 가져오기 함수
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }

    // Bearer 접두사가 없으면 추가
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const fetchBookList = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 🔥 동적으로 토큰 가져오기
        const authToken = getAuthToken();

        const response = await fetch(`${apiBaseUrl}/api/gallery/mylist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        });

        // 🔥 토큰 에러 처리
        if (response.status === 403) {
          localStorage.removeItem("authToken");
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        }

        if (!response.ok) {
          throw new Error(`서버 응답 실패 (${response.status})`);
        }

        const json = await response.json();
        const books = json.data?.books || [];
        console.log("📖 Book 객체 구조 확인:", books[0]); // 구조 확인용
        console.log("📖 모든 속성:", Object.keys(books[0] || {})); // 속성명 확인용
        setBookData(books);
        setFilteredData(books);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        setError(err.message);

        // 토큰 관련 에러인 경우 로그인 페이지로 리다이렉트
        if (err.message.includes("로그인") || err.message.includes("인증")) {
          // window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookList();
  }, []);

  // hover 시 책 상세 정보(제목, quote) 가져오기
  const fetchBookDetails = async (bookId) => {
    // 이미 로딩 중이거나 상세정보가 있으면 반환
    if (loadingDetails[bookId] || bookDetails[bookId]) {
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [bookId]: true }));

    try {
      // 🔥 동적으로 토큰 가져오기
      const authToken = getAuthToken();

      // bookId를 사용해서 detail API 호출
      const res = await fetch(`${apiBaseUrl}/api/gallery/detail/${bookId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      // 🔥 토큰 에러 처리
      if (res.status === 403) {
        localStorage.removeItem("authToken");
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }

      if (res.ok) {
        const detailJson = await res.json();
        const detailData = {
          title: detailJson.data?.title || "",
          quote: detailJson.data?.quote || "",
          author: detailJson.data?.author || "",
        };
        setBookDetails((prev) => ({ ...prev, [bookId]: detailData }));
      } else {
        console.error(`❌ Detail API 에러 (${res.status}):`, res.statusText);
        setBookDetails((prev) => ({
          ...prev,
          [bookId]: { title: "", quote: "상세 정보를 불러올 수 없습니다" },
        }));
      }
    } catch (error) {
      console.error("❌ 상세 정보 불러오기 실패:", error);

      // 토큰 관련 에러인 경우
      if (error.message.includes("로그인") || error.message.includes("인증")) {
        setBookDetails((prev) => ({
          ...prev,
          [bookId]: { title: "", quote: "로그인이 필요합니다" },
        }));
        // window.location.href = '/login';
      } else {
        setBookDetails((prev) => ({
          ...prev,
          [bookId]: { title: "", quote: "상세 정보를 불러올 수 없습니다" },
        }));
      }
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [bookId]: false }));
    }
  };

  const filteredBooks = filteredData.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div>
        <Nav />
        <GalleryMark />
        <div
          className="loading-container"
          style={{ textAlign: "center", padding: "50px", color: "#666" }}
        >
          <p>책 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div>
        <Nav />
        <GalleryMark />
        <div
          className="error-container"
          style={{ textAlign: "center", padding: "50px", color: "#e74c3c" }}
        >
          <p>오류: {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
        {filteredBooks.length === 0 ? (
          <div
            className="no-books-message"
            style={{ textAlign: "center", padding: "50px", color: "#999" }}
          >
            {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : ""}
          </div>
        ) : (
          filteredBooks.map((book, index) => (
            <div className="book-card" key={index}>
              <div
                className="book-cover-wrapper"
                onMouseEnter={() => fetchBookDetails(book.bookId)}
              >
                <img src={book.cover} alt={book.title} className="book-cover" />
                <div className="hover-overlay">
                  {loadingDetails[book.bookId] ? (
                    <div>
                      <p className="book-quote">상세 정보를 불러오는 중...</p>
                    </div>
                  ) : bookDetails[book.bookId] ? (
                    <div>
                      <h3 className="detailed-title">
                        {bookDetails[book.bookId].title || book.title}
                      </h3>
                      {bookDetails[book.bookId].author && (
                        <p className="book-author">
                          저자: {bookDetails[book.bookId].author}
                        </p>
                      )}
                      <p className="book-quote">
                        {bookDetails[book.bookId].quote || "명언이 없습니다"}
                      </p>
                    </div>
                  ) : (
                    <p className="book-quote">
                      마우스를 올려 상세 정보를 확인하세요
                    </p>
                  )}
                  <button className="view-button">View</button>
                </div>
              </div>
              <p className="book-title">{book.title}</p>
            </div>
          ))
        )}
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
