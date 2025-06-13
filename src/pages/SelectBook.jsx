import React, { useState, useEffect } from "react";
import styles from "../styles/selectbook.module.css";
import Nav from "../components/Nav";

const SelectBook = () => {
  const [books, setBooks] = useState([]);
  const [centerIndex, setCenterIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(true);

  useEffect(() => {
    const apiBaseUrl = "http://3.38.185.232:8080";

    fetch(`${apiBaseUrl}/api/gallery/mylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJheXVuQG5hdmVyLmNvbSIsImlhdCI6MTc0OTY5Mzk1NSwiZXhwIjoxNzQ5NzExOTU1fQ.wljBQQUv38gXm5tKqLBi4feqBdl3au2OTkKqvhYTGY8",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const newPageBook = {
          title: "뉴페이지",
          cover: "/assets/images/newpage.png",
        };
        const booksFromServer = json.data?.books || [];
        const bookCovers = booksFromServer.map((book) => ({
          title: book.title,
          cover: book.cover,
        }));
        setBooks([newPageBook, ...bookCovers]);
        setCenterIndex(0);
      })
      .catch((err) => console.error("📕 책 커버 로딩 실패", err));
  }, []);

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
                transform: `translateX(${
                  offset * baseX
                }px) translateY(${translateY}px) scale(${scale})`,
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
            <div className={styles.plusIconCenter}>＋</div>
          ) : (
            <div className={styles.editIconCenter}>✎</div>
          )}

          {!isNewPageCenter && (
            <div className={styles.plusIconBottomRight}>＋</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectBook;
