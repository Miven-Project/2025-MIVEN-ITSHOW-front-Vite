import React from "react";
import styles from "../ModalContent.module.css"

const MAX_RATING = 5;
const mainColor = "var(--Main_Color, #15719E)";
const grayColor = "#B7C2C8";

const InfoPanel = ({
  info = {},
  writer = "",
  reading = {},
  reviewDetail = {},
  rating = 0,
  onBackClick,
  BookIcon
}) => {
  return (
    <div className="info-panel">
      <h3 className={styles["section-title"]}>기본 정보</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>ISBN</span>
          <span className={styles["info-value"]}>{info.isbn || "-"}</span>
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>발행일자</span>
          <span className={styles["info-value"]}>{info.publishDate || "-"}</span>
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>출판사</span>
          <span className={styles["info-value"]}>{info.publisher || "-"}</span>
        </div>
      </div>

      <h3 className={styles["section-title"]}>독서</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>독서 기간</span>
          <span className={styles["info-value"]}>{reading.period || "-"}</span>
        </div>
        <div className={styles["info-item"]}>
          <span className={styles["info-label"]}>작성자</span>
          <span className={styles["info-value"]}>{writer || "-"}</span>
        </div>
      </div>

      <h3 className={styles["section-title"]}>리뷰</h3>
      <div className={styles["section-block"]}>
        <div className={styles["info-panel-blur"]}></div>
        {/* <div className={styles["info-item"]}>{writer || '-'}님의 평점</div> */}
        <div className={styles["info-item"]}>
          <span className={styles["review-writer"]}>
            {writer || "-"}님의 평점
          </span>
        </div>
        <div className={styles["info-item"]}>
          <div className={styles["review-row"]}>
            <div className={styles["review-rating"]}>
              {[...Array(MAX_RATING)].map((_, idx) => (
                <BookIcon className={styles["book-icon"]}
                  key={idx}
                  fill={idx < Math.round(rating) ? mainColor : grayColor}
                  style={{ marginRight: 2 }}
                />
              ))}
              <span className={styles["rating-value"]}>{rating || 0}</span>
              <span className={styles["summary-rating-max"]}> / 5</span>
            </div>
            <span className={styles["review-comment"]}>
              {reviewDetail.comment || reviewDetail.text || "아직 리뷰가 작성되지 않았습니다."}
            </span>
          </div>
        </div>
      </div>

      <button className={styles["info-back-button"]} onClick={onBackClick}>← 뒤로가기</button>
    </div>
  );
};


export default InfoPanel;