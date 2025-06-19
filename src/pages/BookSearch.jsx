// BookSearch.jsx - 수정된 버전
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import booksData from "../data/book.json";
import styles from "../styles/BookSearch.module.css";
import Nav from "../pages/Home.jsx";
import { DebounceInput } from "react-debounce-input";
import bookSearchImg from "../assets/images/Book Search.png";
import bookSearchImg2 from "../assets/images/Book Search2.png";
import searchIcon from "../assets/images/search-icon.png";

const apiBaseUrl = "https://leafin.mirim-it-show.site";

// 🔥 바뫐 부분 : 서버에서 책 존재 여부 확인하는 함수 추가
// 바뫐 부분 : 제목으로 서버에 등록된 책인지 확인하여 gNo를 반환하는 함수
// 되야하는 동작 : 네이버 API 책이 서버에도 등록되어 있으면 gNo를 반환, 없으면 null 반환
const checkBookExistsOnServer = async (bookTitle) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("토큰이 없어서 서버 확인 불가");
      return null;
    }

    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await axios.get(`${apiBaseUrl}/api/gallery/list`, {
      params: { keyword: " " }, // 전체 목록을 가져오기 위해 공백 사용
      headers: { Authorization: formattedToken }
    });

    if (response.data.code === 200 && response.data.data?.books) {
      const books = response.data.data.books;

      // HTML 태그 제거 함수
      const stripHtml = (text) => text?.replace(/<[^>]*>/g, '') || '';

      const matchedBook = books.find(book => {
        const serverTitle = stripHtml(book.title).trim();
        const searchTitle = stripHtml(bookTitle).trim();
        return serverTitle === searchTitle;
      });

      return matchedBook ? matchedBook.bookId : null;
    }

    return null;
  } catch (error) {
    console.error("서버 책 확인 실패:", error);
    return null;
  }
};


const BookSearch = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const hasQuery = query.trim() !== "";
  const navigate = useNavigate();
  const from = location.state?.from || "nav"; // 기본은 nav

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // const encodedQuery = encodeURIComponent(query);
        const response = await axios.get(`${apiBaseUrl}/api/naver/book?`, {
          params: { query },
        });
        setSearchResults(response.data.items);

        console.log("검색 API 응답 데이터:", response.data); // ← 이거 꼭 찍어보세요
      } catch (error) {
        console.error("도서 검색 실패:", error);
      }
    };

    if (query.trim().length > 0) {
      fetchBooks();
    }
  }, [query]);


  const handleBookClick = async (book, index) => {
    console.log("클릭된 책:", book);
    console.log("클릭된 인덱스:", index);
    console.log("from 값:", from);

    // book.json 데이터인지 Naver API 데이터인지 구분
    const isFromBookJson = !hasQuery; // 검색어가 없으면 book.json 데이터

    if (from === "selectBook") {
      // BookInput으로 가는 경우 (책 등록)
      const selectedBook = {
        title: book.title,
        image: book.image,
        isbn: book.isbn,
        pubdate: book.pubdate,
        publisher: book.publisher,
        author: book.author,
      };
      navigate("/bookinput", { state: { book: selectedBook } });
    } else {
      // BookDetail으로 가는 경우
      if (isFromBookJson && book.bookId) {
        // book.json에서 온 데이터 - bookId 사용
        console.log("book.json 데이터, bookId:", book.bookId);
        navigate(`/bookdetail/${book.bookId}`, { state: { book } });
      } else if (isFromBookJson && book.id) {
        // book.json에서 온 데이터 - id 사용 (fallback)
        console.log("book.json 데이터, id:", book.id);
        navigate(`/bookdetail/${book.id}`, { state: { book } });
      } else {
        // 🔥 바뀐 부분 : Naver API 데이터의 경우 ISBN 처리 로직 수정
        // 바뫐 부분 : navigate 경로에서 변수 오류 수정 및 temp- ISBN 생성 로직 추가
        // 되야하는 동작 : Naver API 책은 실제 ISBN이 없을 수 있으므로 temp- ISBN을 생성해서 상세 페이지로 이동
        console.log("Naver API 데이터 처리 시작");
        const selectedBook = {
          title: book.title,
          image: book.image,
          isbn: book.isbn,
          pubdate: book.pubdate,
          publisher: book.publisher,
          author: book.author,
        };

        // 서버에 등록된 책인지 확인
        const gNo = await checkBookExistsOnServer(book.title);

        if (gNo) {
          // 서버에 등록된 책이면 gNo 경로로 이동
          console.log("서버에 등록된 책, gNo로 이동:", gNo);
          navigate(`/bookdetail/gno/${gNo}`, { state: { book: selectedBook } });
        } else {
          // 서버에 없는 책이면 ISBN 경로로 이동
          const bookIsbn = book.isbn || `temp-${Date.now()}-${index}`;
          console.log("서버에 없는 책, ISBN으로 이동:", bookIsbn);
          navigate(`/bookdetail/isbn/${bookIsbn}`, { state: { book: selectedBook } });
        }
      }
    }
  };

  return (
    <div>
      <div className="NavWrapper">
        <Nav showBackGradient={false} />
      </div>

      <div className={styles.booksearchContainer}>
        {/* 상단 이미지들 */}

        <img
          src={bookSearchImg}
          alt="Book Search"
          className={styles.booksearchTopImage}
        />
        <img
          src={bookSearchImg2}
          alt="Book Search 2"
          className={styles.booksearchTopImage2}
        />


        {/* 검색창 */}
        <div className={styles.booksearchInputContainer}>
          <div className={styles.searchInputWrapper}>
            <img
              src={searchIcon}
              alt="Search Icon"
              className={styles.searchIcon}
            />
            <DebounceInput
              type="text"
              className={styles.booksearchInput}
              placeholder="책 제목을 입력해 주세요"
              debounceTimeout={100}
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
                <div key={book.bookId || book.id || idx} onClick={() => handleBookClick(book, idx)}>
                  <BookCard
                    id={book.bookId || book.id || idx}
                    image={book.cover || book.image}
                    title={book.title || "제목 없음"}
                    author={book.writer || book.author || "저자 정보 없음"}
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
                <div key={`search-${idx}`} onClick={() => handleBookClick(book, idx)}>
                  <BookCard
                    id={`search-${idx}`}
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