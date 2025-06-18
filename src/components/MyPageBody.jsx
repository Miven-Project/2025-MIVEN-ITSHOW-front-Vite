import React, { useEffect, useState } from "react";
import styles from "../styles/MyPageBody.module.css";
import "../global.css";

export default function MyPageBody({ authToken = null }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 토큰 가져오기 함수
  const getAuthToken = () => {
    // 1. props로 받은 토큰 우선 사용
    let token = authToken;

    // 2. props에 없으면 localStorage에서 읽기
    if (!token) {
      token = localStorage.getItem("authToken");
    }

    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }

    // Bearer 접두사가 없으면 추가
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    const apiBaseUrl = "https://leafin.mirim-it-show.site";

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 동적으로 토큰 가져오기
        const token = getAuthToken();

        const response = await fetch(`${apiBaseUrl}/api/gallery/mylist`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        // 🔥 상태 코드 체크
        if (response.status === 403) {
          // 토큰이 만료된 경우 localStorage에서 제거
          localStorage.removeItem("authToken");
          throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }

        if (response.status === 401) {
          // 인증 실패
          localStorage.removeItem("authToken");
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
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

        // 토큰 관련 에러인 경우 로그인 페이지로 리다이렉트하거나 처리
        if (err.message.includes("로그인") || err.message.includes("인증")) {
          // 여기서 로그인 페이지로 리다이렉트하거나 상위 컴포넌트에 알림
          // 예: window.location.href = '/login';
        }
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

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorText}>{error}</div>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    );
  }

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

      <div className={styles.emptyCtn}></div>
    </div>
  );
}
