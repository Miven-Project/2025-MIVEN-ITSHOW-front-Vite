import React from "react";
import styles from "../styles/BookInputPage.module.css";
import bookIcon from "../assets/images/bookicon.png";

const BookForm = ({
    book,
    formData,
    onInputChange,
    rating,
    onRatingChange,
    readingStartSelected,
    readingEndSelected,
    formatDateKR,
    isLoading,
    onSave,
    userNickname,
}) => {
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
            {/* BackButton은 필요에 따라 상위 컴포넌트에서 넣어주세요 */}

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
                                        onChange={(e) => onInputChange("isbn", e.target.value)}
                                    />
                                </div>
                                <div className={styles["info-item"]}>
                                    <span className={styles["info-label"]}>발행(출간)일자</span>
                                    <input
                                        type="text"
                                        className={styles["info-input"]}
                                        placeholder="YYYYMMDD 또는 YYYY-MM-DD"
                                        value={formData.publishDate}
                                        onChange={(e) => onInputChange("publishDate", e.target.value)}
                                    />
                                </div>
                                <div className={styles["info-item"]}>
                                    <span className={styles["info-label"]}>출판사</span>
                                    <input
                                        type="text"
                                        className={styles["info-input"]}
                                        placeholder="출판사를 입력해주세요"
                                        value={formData.publisher}
                                        onChange={(e) => onInputChange("publisher", e.target.value)}
                                    />
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
                                            onChange={(e) => onInputChange("readingStart", e.target.value)}
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
                                            onChange={(e) => onInputChange("readingEnd", e.target.value)}
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
                                            className={`${styles.star} ${rating >= value ? styles.active : ""
                                                }`}
                                            onClick={() => onRatingChange(value)}
                                        />
                                    ))}
                                    <span className={styles["rating-value"]}>{rating}</span>
                                    <input
                                        type="text"
                                        className={styles["info-input-review"]}
                                        placeholder="한줄 소감을 작성해 주세요"
                                        value={formData.shortReview}
                                        onChange={(e) => onInputChange("shortReview", e.target.value)}
                                        style={{ marginLeft: "10px", width: "180px" }}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={onSave}
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
                                onChange={(e) => onInputChange("quote", e.target.value)}
                                rows={6}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookForm;
