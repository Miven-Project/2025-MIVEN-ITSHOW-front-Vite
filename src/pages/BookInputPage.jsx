import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/BookInputPage.module.css";
import BackButton from "../components/BackButton";
import bookIcon from "../assets/images/bookicon.png";

const BookInputPage = () => {
  const { state } = useLocation();
  const book = state?.book;

  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const [formData, setFormData] = useState({
    isbn: book?.isbn || "",
    publishDate: book?.pubdate || "",
    publisher: book?.publisher || "",
    readingStart: "",
    readingEnd: "",
    writer: "",
    quote: "",
    shortReview: "",
  });

  const [readingStartSelected, setReadingStartSelected] = useState(false);
  const [readingEndSelected, setReadingEndSelected] = useState(false);

  const apiBaseUrl = "https://leafin.mirim-it-show.site";

  // 🔥 네이버 API 책 정보를 localStorage에 저장하는 함수
  const saveNaverBookData = (bookData) => {
    if (!bookData?.isbn) return;
    
    try {
      // 1. 현재 책 정보 저장
      localStorage.setItem('currentBook', JSON.stringify(bookData));
      
      // 2. ISBN 기반 네이버 책 데이터베이스에 저장
      const existing = localStorage.getItem('naverBookDatabase');
      const database = existing ? JSON.parse(existing) : {};
      database[bookData.isbn] = bookData;
      localStorage.setItem('naverBookDatabase', JSON.stringify(database));
      
      console.log("✅ 네이버 API 책 정보를 localStorage에 저장:", bookData);
    } catch (error) {
      console.error("localStorage 저장 실패:", error);
    }
  };

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  const getPureToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    }
    return token.startsWith("Bearer ") ? token.slice(7) : token;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(`${apiBaseUrl}/api/profile`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("프로필 정보를 가져오지 못했습니다.");
        }

        const result = await response.json();
        const nickname = result.data?.name || "";

        setUserNickname(nickname);
        setFormData((prev) => ({
          ...prev,
          writer: nickname,
        }));
      } catch (error) {
        console.error("프로필 가져오기 실패:", error);
      }
    };

    fetchUserProfile();
    
    // 🔥 book 정보를 localStorage에 저장 (네이버 API 원본 데이터)
    if (book?.publisher && book?.isbn) {
      console.log("📚 BookInputPage에서 네이버 API book 정보 저장:", book);
      saveNaverBookData(book);
    }
  }, [book]);

  const formatDateKR = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatPublishDate = (rawDate) => {
    if (!rawDate || rawDate.includes("-")) return rawDate;
    if (rawDate.length !== 8) return rawDate;
    const year = rawDate.slice(0, 4);
    const month = rawDate.slice(4, 6);
    const day = rawDate.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "readingStart") {
      setReadingStartSelected(!!value);
    } else if (field === "readingEnd") {
      setReadingEndSelected(!!value);
    }
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const getUserInfoFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        email: payload.sub,
        userId: payload.userId || payload.sub,
      };
    } catch (error) {
      console.error("토큰 파싱 실패:", error);
      return null;
    }
  };

  const postGallery = async (galleryData) => {
    setIsLoading(true);
    try {
      const authToken = getAuthToken();
      const pureToken = getPureToken();

      const userInfo = getUserInfoFromToken(pureToken);
      if (!userInfo) {
        throw new Error("사용자 정보를 토큰에서 추출할 수 없습니다.");
      }

      const dataWithUser = {
        ...galleryData,
        userEmail: userInfo.email,
        userId: userInfo.userId,
      };

      console.log("사용자 정보가 포함된 전송 데이터:", dataWithUser);

      const response = await fetch(`${apiBaseUrl}/api/gallery/regist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(dataWithUser),
      });

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem("authToken");
          throw new Error("인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.");
        } else if (response.status === 401) {
          localStorage.removeItem("authToken");
          throw new Error("인증이 필요합니다. 로그인해주세요.");
        }

        const errorText = await response.text();
        throw new Error(`서버 오류 (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      console.log("갤러리 저장 서버 응답:", result);

      if (result.code === 200) {
        const savedBook = result.data?.books?.find((b) => b.title === book.title) || {};
        const bookId = savedBook.bookId;

        alert(
          `"${book.title}"이(가) 성공적으로 저장되었습니다!\n` +
          `평점: ${rating}점\n` +
          `등록 시간: ${savedBook.regTime || "방금 전"}\n` +
          (bookId ? `도서 ID: ${bookId}` : "")
        );
      } else {
        throw new Error(`응답 오류: ${result.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("갤러리 저장 실패:", error);

      if (
        error.message.includes("토큰") ||
        error.message.includes("인증") ||
        error.message.includes("로그인")
      ) {
        alert(`${error.message}`);
      } else {
        alert(`갤러리 등록 중 오류가 발생했습니다.\n오류: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return false;
    }
    if (!formData.readingStart) {
      alert("독서 시작 날짜를 선택해주세요.");
      return false;
    }
    if (!formData.readingEnd) {
      alert("독서 완료 날짜를 선택해주세요.");
      return false;
    }

    if (new Date(formData.readingStart) > new Date(formData.readingEnd)) {
      alert("시작 날짜는 완료 날짜보다 이전이어야 합니다.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      getAuthToken();
    } catch (error) {
      alert(error.message);
      return;
    }

    if (!validateForm()) return;

    // 🔥 네이버 API 데이터 미리 저장 (갤러리 저장 전에)
    if (book?.publisher && book?.isbn) {
      saveNaverBookData(book);
    }

    const galleryData = {
      title: book.title,
      cover: book.image,
      isbn: formData.isbn,
      publicDate: formatPublishDate(formData.publishDate),
      period: `${formatDateKR(formData.readingStart)} ~ ${formatDateKR(formData.readingEnd)}`,
      rating: rating,
      review: formData.shortReview,
      quote: formData.quote,
      pages: book?.pages || 0,
      writer: formData.writer,
      publisher: book.publisher, // 🔥 출판사 정보도 서버에 전송
    };

    console.log("🚀 최종 서버 전송 데이터:", galleryData);
    await postGallery(galleryData);
  };

  if (!book) {
    return (
      <div className={styles.container}>
        <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          책 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${book.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={styles.blurOverlay}></div>
      <BackButton />
      <div className={styles["page-title"]}>{book.title}</div>
      <div className={styles["page-content-wrapper"]}>
        <div className={styles["modal-content"]}>
          <div className={styles["blur-background"]}></div>
          <div className={styles["content-wrapper"]}>
            <div className={styles["book-cover-section"]}>
              <img
                src={book.image}
                alt={book.title}
                className={styles["book-cover"]}
              />
            </div>

            <div className={styles["info-panel"]}>
              <div className={styles["section-title"]}>기본정보</div>
              <div className={styles["section-block"]}>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>ISBN</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="ISBN을 입력해주세요"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>발행(출간)일자</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="YYYYMMDD 또는 YYYY-MM-DD"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange("publishDate", e.target.value)}
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>출판사</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="출판사를 입력해주세요"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange("publisher", e.target.value)}
                  />
                  {/* 🔥 출판사 정보 표시 */}
                  
                </div>
              </div>

              <div className={styles["section-title"]}>독서</div>
              <div className={styles["section-block"]}>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>시작 날짜 *</span>
                  {!readingStartSelected ? (
                    <input
                      type="date"
                      className={styles["info-input"]}
                      value={formData.readingStart}
                      onChange={(e) => handleInputChange("readingStart", e.target.value)}
                      required
                    />
                  ) : (
                    <span
                      className={styles["info-input"]}
                      style={{
                        pointerEvents: "none",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      {formatDateKR(formData.readingStart)}
                    </span>
                  )}
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>끝난 날짜 *</span>
                  {!readingEndSelected ? (
                    <input
                      type="date"
                      className={styles["info-input"]}
                      value={formData.readingEnd}
                      onChange={(e) => handleInputChange("readingEnd", e.target.value)}
                      min={formData.readingStart}
                      required
                    />
                  ) : (
                    <span
                      className={styles["info-input"]}
                      style={{
                        pointerEvents: "none",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      {formatDateKR(formData.readingEnd)}
                    </span>
                  )}
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>작성자</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="작성자를 입력해주세요 (선택사항)"
                    value={formData.writer}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles["section-title"]}>리뷰</div>
              <div className={styles["rating-section"]}>
                <div className={styles["rating-title"]}>
                  {userNickname ? `${userNickname}의 평점` : "이책바의 평점"} *
                </div>
                <div className={styles["rating-stars"]}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <img
                      key={value}
                      src={bookIcon}
                      alt="book rating"
                      className={`${styles.star} ${rating >= value ? styles.active : ""}`}
                      onClick={() => handleRating(value)}
                    />
                  ))}
                  <span className={styles["rating-value"]}>{rating}</span>
                  <input
                    type="text"
                    className={styles["info-input-review"]}
                    placeholder="한줄 소감을 작성해 주세요"
                    value={formData.shortReview}
                    onChange={(e) => handleInputChange("shortReview", e.target.value)}
                    style={{ marginLeft: "10px", width: "180px" }}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className={styles["save-button"]}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "저장중..." : "저장하기"}
              </button>
            </div>
          </div>

          <div className={styles["right-section"]}>
            <div className={styles["quote-text"]}></div>
            <div className={styles["quote-input-area"]}>
              <textarea
                className={styles["quote-input"]}
                placeholder="간직하고 싶은 인상 깊은 구절을 작성해 보세요"
                value={formData.quote}
                onChange={(e) => handleInputChange("quote", e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInputPage;