// BookInputPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/BookInputPage.module.css";
import BackButton from "../components/BackButton";

const BookInputPage = () => {
  const { state } = useLocation();
  const book = state?.book;

  const [rating, setRating] = useState(0);

  const [formData, setFormData] = useState({
    isbn: book?.isbn || "",
    publishDate: book?.pubdate || "",
    publisher: book?.publisher || "",
    readingPeriod: "",
    writer: "",
    quote: "",
    shortReview: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSave = () => {
    const saveData = {
      book: book.title,
      author: book.author,
      rating: rating,
      ...formData,
    };

    console.log("저장할 데이터:", saveData);
    alert(`"${book.title}"에 대한 정보가 저장되었습니다!\n평점: ${rating}점`);
  };

  if (!book) return <div>책 정보를 불러오는 중입니다...</div>;

  return (
    <div className={styles.container}>
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
                <span className={styles["info-label"]}>독서기간</span>
                <input
                  type="date"
                  className={styles["info-input"]}
                  value={formData.readingPeriod}
                  onChange={(e) => handleInputChange("readingPeriod", e.target.value)}
                />
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
                  <div
                    key={value}
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
