import React, { useEffect, useState } from "react";
import styles from "../styles/MyPageBody.module.css";
import "../global.css";

export default function MyPageBody() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiBaseUrl = "http://3.38.185.232:8080";
    // 🔥 MyPageHeader와 같은 토큰 사용
    const token =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYW5nbWkxQG5hdmVyLmNvbSIsImlhdCI6MTc1MDA1MDE0NiwiZXhwIjoxNzUwOTE0MTQ2fQ.FhtjUlih_FPC6kcKdgkdD-23h6GJvrAu38tqW5VuZS0";

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${apiBaseUrl}/api/gallery/mylist`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        // 🔥 상태 코드 체크
        if (response.status === 403) {
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 🔥 빈 응답 체크
        const text = await response.text();
        if (!text || text.trim() === "") {
          console.log("서버에서 빈 응답을 받았습니다.");
          setData([]);
          setFilteredData([]);
          return;
        }

        // 🔥 안전한 JSON 파싱
        const json = JSON.parse(text);
        const books = json.data?.books || [];
        setData(books);
        setFilteredData(books);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
                onError={(e) => {
                  e.target.src = "/assets/images/default-book-cover.png"; // 기본 이미지
                }}
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

      {/* 데이터가 아예 없을 때 */}
      {filteredData.length === 0 && searchQuery.trim() === "" && !isLoading && (
        <div className={styles.noDataContainer}>
          <div className={styles.noDataText}>아직 등록된 책이 없습니다.</div>
        </div>
      )}

      <div className={styles.emptyCtn}></div>
    </div>
  );
}
