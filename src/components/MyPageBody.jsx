import React, { useEffect, useState } from "react";
import styles from "../styles/MyPageBody.module.css";
import "../global.css";

export default function MyPageBody() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const apiBaseUrl = "http://3.38.185.232:8080";

    fetch(`${apiBaseUrl}/api/gallery/mylist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc0OTcyNDg0NSwiZXhwIjoxNzQ5NzQyODQ1fQ.pJ6yiFNE0FbXUOkC5idRAkr218q2yZpMszG2RrzTe8Y",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const books = json.data?.books || [];
        setData(books);
        setFilteredData(books); // 초기에는 모든 책을 표시
      })
      .catch((err) => {
        console.error("❌ 데이터 불러오기 실패:", err);
      });
  }, []);

  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const emptyBook = () => {
    const elements = [];

    if (!filteredData) return elements;

    const remainder = filteredData.length % 4;
    const emptyCount = remainder === 0 ? 0 : 4 - remainder;

    for (let i = 0; i < emptyCount; i++) {
      elements.push(<div key={`empty-${i}`} className={styles.bookItem} />);
    }

    return elements;
  };

  return (
    <div>
      {/* 검색창 */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.allBookListCtn}>
        <div className={styles.grid}>
          {filteredData.map((book, index) => (
            <div key={index} className={styles.bookItem}>
              <img
                className={styles.allBookCover}
                src={book.cover}
                alt={book.title}
              />
              <div className={styles.bookTitle}>{book.title}</div>
            </div>
          ))}
          {emptyBook()}
          <div className={styles.lastLine} />
        </div>
      </div>

      {/* 검색 결과가 없을 때 표시 */}
      {filteredData.length === 0 && searchQuery.trim() !== "" && (
        <div className={styles.noResultsContainer}>
          <div className={styles.noResultsText}>
            '{searchQuery}'에 대한 검색 결과가 없습니다.
          </div>
        </div>
      )}

      <div className={styles.emptyCtn}></div>
    </div>
  );
}
