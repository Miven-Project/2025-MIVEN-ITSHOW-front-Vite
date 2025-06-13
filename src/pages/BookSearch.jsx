import React, { useState } from "react";
import BookCard from "../components/BookCard";
import booksData from "../data/book.json";
import styles from "../styles/BookSearch.module.css";
import Nav from "../components/Nav";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const hasQuery = query.trim() !== "";

  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );

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
            <input
              type="text"
              className={styles.booksearchInput}
              placeholder="책 제목을 입력해 주세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 검색어가 없을 때: 모든 책 + 오버레이 */}
        {!hasQuery && (
          <>
            <div className={styles.bookGrid}>
              {booksData.map((book, idx) => (
                <BookCard
                  id={book.id}
                  key={idx}
                  image={book.image}
                  title={book.title}
                  author={book.author}
                />
              ))}
            </div>
            <div className={styles.overlayCtn}>
              <div className={styles.dimOverlay}></div>
            </div>
          </>
        )}

        {/* 검색어가 있을 때: 필터된 결과 */}
        {hasQuery && (
          <div className={styles.resultsGrid}>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, idx) => (
                <BookCard
                  id={book.id}
                  key={idx}
                  image={book.image}
                  title={book.title}
                  author={book.author}
                />
              ))
            ) : (
              <div className={styles.noResultsText}>
                <p>검색 결과가 없습니다.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#999' }}>
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