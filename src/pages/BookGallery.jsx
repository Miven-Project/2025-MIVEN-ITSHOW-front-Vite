import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "../pages/Home.jsx";
import styles from "../styles/BookGallery.module.css";
import searchIcon from "/assets/images/search-icon.png";
import { DebounceInput } from "react-debounce-input";

function BookGallery() {
  const [bookData, setBookData] = useState([]);
  console.log(bookData);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookDetails, setBookDetails] = useState({}); // bookId를 key로 하는 상세 정보 저장소
  const [loadingDetails, setLoadingDetails] = useState({}); // 로딩 상태 관리
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);

  // 🔥 바꾼 부분: navigate 변수 추가
  // 되야하는 동작: View 버튼 클릭 시 해당 책의 상세 페이지로 이동
  const navigate = useNavigate();

  const apiBaseUrl = "https://leafin.mirim-it-show.site";

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
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
        <div>
          <Nav showBackGradient={false} />

        </div>
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
        <Nav showBackGradient={false} />
        <GalleryMark />
        <div
          className={styles["error-container"]}
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
      <Nav showBackGradient={false} />
      <GalleryMark />
      <div className={styles["search-bar-section"]}>
        <div className={styles["search-input-container"]}>
          <img
            src={searchIcon}
            alt="Search Icon"
            className={styles["search-icon"]}
          />
          <DebounceInput
            inputRef={searchInputRef}
            type="text"
            className={styles["book-search-input"]}
            placeholder="책 제목을 입력해 주세요"
            debounceTimeout={100}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      <div className={styles["book-gallery-container"]}>
        {filteredBooks.length === 0 ? (
          <div
            className={styles["no-books-message"]}
            style={{ textAlign: "center", padding: "50px", color: "#999" }}
          >
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#999" }}>
              {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : ""}
            </p>
          </div>
        ) : (
          filteredBooks.map((book, index) => {
            const quote = bookDetails[book.bookId]?.quote || "";
            const quotedHtml = quote ? `&quot;${quote}&quot;` : "명언이 없습니다";

            return (
              <div className={styles["book-card"]} key={index}>
                <div
                  className={styles["book-cover-wrapper"]}
                  onMouseEnter={() => fetchBookDetails(book.bookId)}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className={styles["book-cover"]}
                  />
                  <div className={styles["hover-overlay"]}>
                    {loadingDetails[book.bookId] ? (
                      <div>
                        <p className={styles["book-quote"]}>상세 정보를 불러오는 중...</p>
                      </div>
                    ) : bookDetails[book.bookId] ? (
                      <div>
                        <h3 className={styles["detailed-title"]}>
                          {bookDetails[book.bookId].title || book.title}
                        </h3>
                        {bookDetails[book.bookId].author && (
                          <p className={styles["book-author"]}>
                            저자: {bookDetails[book.bookId].author}
                          </p>
                        )}
                        <p
                          className={styles["book-quote"]}
                          dangerouslySetInnerHTML={{ __html: quotedHtml }}
                        ></p>
                      </div>
                    ) : (
                      <p className={styles["book-quote"]}>
                        마우스를 올려 상세 정보를 확인하세요
                      </p>
                    )}
                    <button
                      className={styles["view-button"]}
                      onClick={() => navigate(`/bookdetail/${book.bookId}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
                <p className={styles["book-title"]}>{book.title}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  function GalleryMark() {
    return (
      <div className={styles["GalleryMark"]}>
        <img
          className="GalleryMark-1"
          src="/assets/images/Gallery-1.png"
          alt="Gallery-1"
        />
        <img
          className={styles["GalleryMark-2"]}
          src="/assets/images/Gallery.png"
          alt="Gallery-2"
        />
      </div>
    );
  }
}

export default BookGallery;