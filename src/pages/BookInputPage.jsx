// BookInputPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/BookInputPage.module.css";
import BackButton from "../components/BackButton";
import bookIcon from "../assets/images/bookicon.png";

const BookInputPage = () => {
  const { state } = useLocation();
  const book = state?.book;

  const [rating, setRating] = useState(0);

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

  // 날짜를 "0000년00월00일" 형태로 변환하는 함수
  const formatDateKR = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${month}월 ${day}일`;
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

  const postQuote = async (quoteData) => {
    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      const result = await response.json();
      console.log("구절 저장 서버 응답:", result);
    } catch (error) {
      console.error("구절 저장 실패:", error);
      alert("인상 깊은 구절 저장 중 오류가 발생했습니다.");
    }
  };

  const postReview = async (reviewData) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      const result = await response.json();
      console.log("리뷰 저장 서버 응답:", result);
    } catch (error) {
      console.error("리뷰 저장 실패:", error);
      alert("리뷰 저장 중 오류가 발생했습니다.");
    }
  };

  // 새로 추가한 함수: /api/reading 에 독서 시작/끝 날짜 POST 요청
  const postReadingDates = async (readingStart, readingEnd) => {
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readingStart, readingEnd }),
      });
      if (!response.ok) {
        throw new Error("독서 날짜 저장 서버 오류");
      }
      const result = await response.json();
      console.log("독서 날짜 저장 서버 응답:", result);
    } catch (error) {
      console.error("독서 날짜 저장 실패:", error);
      alert("독서 날짜 저장 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    const saveData = {
      book: book.title,
      author: book.author,
      rating: rating,
      ...formData,
    };

    console.log("저장할 데이터:", saveData);
    alert(`"${book.title}"에 대한 정보가 저장되었습니다!\n평점: ${rating}점`);

    const quoteData = {
      bookTitle: book.title,
      quote: formData.quote,
      writer: formData.writer,
    };
    await postQuote(quoteData);

    const reviewData = {
      bookTitle: book.title,
      rating: rating,
      review: formData.shortReview,
      writer: formData.writer,
    };
    await postReview(reviewData);

    // 여기서 독서 시작/끝 날짜 서버에 보냄
    await postReadingDates(formData.readingStart, formData.readingEnd);
  };

  if (!book) return <div>책 정보를 불러오는 중입니다...</div>;

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

      <div className={styles["modal-content"]}>
        <div className={styles["blur-background"]}></div>
        <div className={styles["content-wrapper"]}>
          <div className={styles["book-cover-section"]}>
            <img src={book.image} alt={book.title} className={styles["book-cover"]} />
          </div>

          <div className={styles["info-panel"]}>
            <div className={styles["section-title"]}>기본정보</div>
            <div className={styles["section-block"]}>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>ISBN</span>
                <input
                  type="text"
                  className={styles["info-input"]}
                  placeholder="____________"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange("isbn", e.target.value)}
                />
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>발행(출간)일자</span>
                <input
                  type="text"
                  className={styles["info-input"]}
                  placeholder="__년__월__일"
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
              </div>
            </div>

            <div className={styles["section-title"]}>독서</div>
            <div className={styles["section-block"]}>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>시작 날짜</span>
                {!readingStartSelected ? (
                  <input
                    type="date"
                    className={styles["info-input"]}
                    value={formData.readingStart}
                    onChange={(e) => handleInputChange("readingStart", e.target.value)}
                  />
                ) : (
                  <span className={styles["info-input"]} style={{ pointerEvents: "none" }}>
                    {formatDateKR(formData.readingStart)}
                  </span>
                )}
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>끝난 날짜</span>
                {!readingEndSelected ? (
                  <input
                    type="date"
                    className={styles["info-input"]}
                    value={formData.readingEnd}
                    onChange={(e) => handleInputChange("readingEnd", e.target.value)}
                  />
                ) : (
                  <span className={styles["info-input"]} style={{ pointerEvents: "none" }}>
                    {formatDateKR(formData.readingEnd)}
                  </span>
                )}
              </div>
              <div className={styles["info-item"]}>
                <span className={styles["info-label"]}>작성자</span>
                <input
                  type="text"
                  className={styles["info-input"]}
                  placeholder="작성자를 입력해주세요"
                  value={formData.writer}
                  onChange={(e) => handleInputChange("writer", e.target.value)}
                />
              </div>
            </div>

            <div className={styles["section-title"]}>리뷰</div>
            <div className={styles["rating-section"]}>
              <div className={styles["rating-title"]}>이책바의 평점</div>
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
                  className={styles["info-input"]}
                  placeholder="한줄 소감을 작성해 주세요"
                  value={formData.shortReview}
                  onChange={(e) => handleInputChange("shortReview", e.target.value)}
                  style={{ marginLeft: "10px", width: "180px" }}
                />
              </div>
            </div>

            <button onClick={handleSave} className={styles["save-button"]}>
              저장하기
            </button>
          </div>
        </div>

        <div className={styles["right-section"]}>
          <div className={styles["quote-text"]}></div>
          <div className={styles["quote-input-area"]}>
            <textarea
              className={styles["quote-input"]}
              placeholder="'간직하고 싶은 인상 깊은 구절을 작성해 보세요'"
              value={formData.quote}
              onChange={(e) => handleInputChange("quote", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInputPage;
