import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/selectbook.module.css";
import Nav from "../components/Nav";

const SelectBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = "http://3.38.185.232:8080";

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const authToken = getAuthToken();

        const response = await fetch(`${apiBaseUrl}/api/gallery/mylist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        });

        if (response.status === 403 || response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }

        if (!response.ok) {
          throw new Error(`서버 응답 실패 (${response.status})`);
        }

        const json = await response.json();

        // API에서 받은 책 리스트에 bookId 포함되어 있다고 가정
        const booksFromServer = json.data?.books || [];

        // 새 페이지용 책 (추가 버튼 역할)
        const newPageBook = {
          title: "뉴페이지",
          cover: "/assets/images/newpage.png",
          bookId: null,
        };

        // 책 리스트를 bookId 포함하여 저장
        const allBooks = [
          newPageBook,
          ...booksFromServer.map((book) => ({
            title: book.title,
            cover: book.cover,
            bookId: book.bookId || book.gNo || null, // bookId 혹은 gNo 확인
            ...book, // 필요시 원본 데이터도 포함
          })),
        ];

        setBooks(allBooks);
        setCenterIndex(0);
      } catch (err) {
        console.error("📕 책 커버 로딩 실패", err);
        setError(err.message);

        if (err.message.includes("로그인") || err.message.includes("인증")) {
          navigate("/login");
          return;
        }

        setBooks([
          {
            title: "뉴페이지",
            cover: "/assets/images/newpage.png",
            bookId: null,
          },
        ]);
        setCenterIndex(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [navigate]);

  const isNewPageCenter = books[centerIndex]?.title?.trim() === "뉴페이지";

  const getOffset = (index) => {
    let offset = index - centerIndex;
    const half = Math.floor(books.length / 2);
    if (offset > half) offset -= books.length;
    if (offset < -half) offset += books.length;
    return offset;
  };

  useEffect(() => {
    const scrollDelay = 300;

    const handleMove = (direction) => {
      if (!canScroll || books.length === 0) return;
      setCanScroll(false);
      setCenterIndex((prev) =>
        direction === "left"
          ? (prev - 1 + books.length) % books.length
          : (prev + 1) % books.length
      );
      setTimeout(() => setCanScroll(true), scrollDelay);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handleMove("left");
      else if (e.key === "ArrowRight") handleMove("right");
    };

    const handleWheel = (e) => {
      if (e.deltaY > 0) handleMove("right");
      else if (e.deltaY < 0) handleMove("left");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [canScroll, books]);

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <Nav />
        <div
          className={styles.loadingContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
            fontSize: "18px",
            color: "#666",
          }}
        >
          책 목록을 불러오는 중...
        </div>
      </div>
    );
  }

  if (error && !error.includes("로그인") && !error.includes("인증")) {
    return (
      <div className={styles.pageContainer}>
        <Nav />
        <div
          className={styles.errorContainer}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
            fontSize: "16px",
            color: "#e74c3c",
          }}
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
              fontSize: "14px",
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Nav />
      <div className={styles.bookContainer}>
        {books.map((book, index) => {
          const offset = getOffset(index);
          const absOffset = Math.abs(offset);

          let baseX = 300;
          if (absOffset === 1) baseX += 70;
          if (absOffset === 2 || absOffset === 3) baseX += 50;
          if (absOffset === 3 || absOffset === 4) baseX += -20;

          const scaleMap = [1.2, 1.05, 0.9, 0.8];
          const yMap = [-120, -50, 40, 110];

          const scale = scaleMap[absOffset] || 0;
          let translateY = yMap[absOffset] || 120;
          if (absOffset === 2 || absOffset === 3) translateY -= 2;

          const zIndex = 10 - absOffset;
          const opacity = absOffset > 3 ? 0 : 1;

          return (
            <div
              key={index}
              className={styles.book}
              style={{
                transform: `translateX(${offset * baseX}px) translateY(${translateY}px) scale(${scale})`,
                zIndex,
                opacity,
              }}
            >
              <img src={book.cover} alt={book.title} />
            </div>
          );
        })}

        <div className={styles.iconContainer}>
          {isNewPageCenter ? (
            <div
              className={styles.plusIconCenter}
              onClick={() => navigate("/booksearch", { state: { from: "selectBook" } })}
              style={{ cursor: "pointer" }}
            >
              ＋
            </div>
          ) : (
            <div
              className={styles.editIconCenter}
              onClick={() =>
                navigate("/editbookpage", {
                  state: {
                    book: books[centerIndex],
                    existingData: books[centerIndex], // 필요하면 분리해서 다르게 넘겨도 됨
                  },
                })
              }
              style={{ cursor: "pointer" }}
            >
              ✎
            </div>
          )}

          {!isNewPageCenter && (
            <div
              className={styles.plusIconBottomRight}
              onClick={() => navigate("/booksearch", { state: { from: "selectBook" } })}
              style={{ cursor: "pointer" }}
            >
              ＋
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectBook;
