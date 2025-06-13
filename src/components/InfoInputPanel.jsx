import React from "react";
// import styles from "../components/BookDetail/ModalContent.module.css";
import styles from "../styles/InfoInputPanel.module.css"

const MAX_RATING = 5;
const mainColor = "var(--Main_Color, #15719E)";
const grayColor = "#B7C2C8";

const InfoInputPanel = ({
  info = {},
  writer = '',
  reading = {},
  reviewDetail = {},
  rating = 0,
  onInfoChange,
  onRatingChange
}) => {
  return (
    <div className="info-panel">
      <h3 className={styles["section-title"]}>기본 정보</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>ISBN</span>
          <input
            className={`${styles["info-value-input"]}`}
            type="text"
            value={info.isbn || ''}
            onChange={(e) => onInfoChange("isbn", e.target.value)}
          />
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>발행일자</span>
          <input
            className={styles["info-value-input"]}
            type="date"
            value={info.publishDate || ''}
            onChange={(e) => onInfoChange("publishDate", e.target.value)}
          />
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>쪽수</span>
          <input
            className={styles["info-value-input"]}
            type="number"
            value={info.pages || ''}
            onChange={(e) => onInfoChange("pages", e.target.value)}
          />
        </div>
      </div>

      <h3 className={styles["section-title"]}>독서</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>독서 기간</span>
          <input
            className={`${styles["info-value-input"]}`}
            type="text"
            value={reading.period || ''}
            onChange={(e) => onInfoChange("readingPeriod", e.target.value)}
            placeholder="예: 2025.01.01 ~ 2025.01.10"
          />
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>작성자</span>
          <input
            className={`${styles["info-value-input"]}`}
            type="text"
            value={writer || ''}
            onChange={(e) => onInfoChange("writer", e.target.value)}
          />
        </div>
      </div>

      <h3 className={styles["section-title"]}>리뷰</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        <div className={styles["info-item"]}>
          <span className={styles["review-writer"]}>
            {writer || '-'}님의 평점
          </span>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["review-row"]}>
            <div className={styles["review-rating"]}>
              {[...Array(MAX_RATING)].map((_, idx) => (
                <svg
                  key={idx}
                  className={styles["book-icon"]}
                  onClick={() => onRatingChange(idx + 1)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={idx < Math.round(rating) ? mainColor : grayColor}
                  style={{ marginRight: 2, cursor: "pointer" }}
                >
                  <path d="M6 4v16l6-4 6 4V4H6z" />
                </svg>
              ))}
              <span className={styles["rating-value"]}>{rating || 0}</span>
              <span className={styles["summary-rating-max"]}> / 5</span>
            </div>
            <textarea
              className={styles["review-comment-input"]}
              value={reviewDetail.comment || ''}
              onChange={(e) => onInfoChange("reviewComment", e.target.value)}
              placeholder="리뷰를 작성해주세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoInputPanel;
