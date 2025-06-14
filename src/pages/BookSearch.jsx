// BookSearch.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import booksData from "../data/book.json";
import styles from "../styles/BookSearch.module.css";
import Nav from "../components/Nav";
import { DebounceInput } from "react-debounce-input";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const hasQuery = query.trim() !== "";
  const navigate = useNavigate();

  // 검색 기능 (Naver API)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/naver-api/v1/search/book.json", {
          params: { query },
          headers: {
            "X-Naver-Client-Id": "4gzXh5h99U1wXPgELMhm",
            "X-Naver-Client-Secret": "eu8bsRmFqh",
          },
        });
        setSearchResults(response.data.items);
      } catch (error) {
        console.error("도서 검색 실패:", error);
      }
    };
    if (query.trim().length > 0) {
      fetchBooks();
    }
  }, [query]);

  const handleBookClick = (book) => {
    const bookData = {
      title: book.title,
      image: book.image,
      isbn: book.isbn,
      pubdate: book.pubdate,
      publisher: book.publisher,
      author: book.author,
    };
    navigate("/bookinput", { state: { book: bookData } });
  };

  return (
    <div>
      <div className="NavWrapper">
        <Nav showBackGradient={false} />
      </div>

      <div className={styles.booksearchContainer}>
        {/* 상단 이미지들 */}
        <img
          src="/assets/images/Book Search.png"
          alt="Book Search"
          className={styles.booksearchTopImage}
        />
        <img
          src="/assets/images/Book Search2.png"
          alt="Book Search 2"
          className={styles.booksearchTopImage2}
        />

        {/* 검색창 */}
        <div className={styles.booksearchInputContainer}>
          <div className={styles.searchInputWrapper}>
            <img
              src="/assets/images/search-icon.png"
              alt="Search Icon"
              className={styles.searchIcon}
            />
            <DebounceInput
              type="text"
              className={styles.booksearchInput}
              placeholder="책 제목을 입력해 주세요"
              debounceTimeout={3000}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 검색어가 없을 때: book.json의 모든 책 + 딤 오버레이 */}
        {!hasQuery && (
          <>
            <div className={styles.bookGrid}>
              {booksData.map((book, idx) => (
                <div key={idx} onClick={() => handleBookClick(book)}>
                  <BookCard
                    id={book.id}
                    image={book.image}
                    title={book.title || "제목 없음"}
                    author={book.author || "저자 정보 없음"}
                  />
                </div>
              ))}
            </div>
            <div className={styles.overlayCtn}>
              <div className={styles.dimOverlay}></div>
            </div>
          </>
        )}

        {/* 검색어가 있을 때: Naver API 검색 결과 */}
        {hasQuery && (
          <div className={styles.resultsGrid}>
            {searchResults.length > 0 ? (
              searchResults.map((book, idx) => (
                <div key={idx} onClick={() => handleBookClick(book)}>
                  <BookCard
                    id={idx}
                    image={book.image}
                    title={book.title || "제목 없음"}
                    author={book.author || "저자 정보 없음"}
                  />
                </div>
              ))
            ) : (
              <div className={styles.noResultsText}>
                <p>검색 결과가 없습니다.</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#999" }}>
                  다른 키워드로 검색해보세요.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;