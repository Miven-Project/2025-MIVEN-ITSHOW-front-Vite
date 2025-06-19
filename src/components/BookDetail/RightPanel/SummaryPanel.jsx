import React from "react";
import styles from "../ModalContent.module.css"

const MAX_RATING = 5;
const mainColor = "var(--Main_Color, #15719E)";
const grayColor = "#B7C2C8";

const HeartIcon = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 21 20" fill="none" {...props}>
            <path d="M10.605 16.9482L10.5 17.0572L10.3845 16.9482C5.397 12.2507 2.1 9.14441 2.1 5.99455C2.1 3.81471 3.675 2.17984 5.775 2.17984C7.392 2.17984 8.967 3.26975 9.5235 4.75204H11.4765C12.033 3.26975 13.608 2.17984 15.225 2.17984C17.325 2.17984 18.9 3.81471 18.9 5.99455C18.9 9.14441 15.603 12.2507 10.605 16.9482ZM15.225 0C13.398 0 11.6445 0.882834 10.5 2.26703C9.3555 0.882834 7.602 0 5.775 0C2.541 0 0 2.6267 0 5.99455C0 10.1035 3.57 13.4714 8.9775 18.5613L10.5 20L12.0225 18.5613C17.43 13.4714 21 10.1035 21 5.99455C21 2.6267 18.459 0 15.225 0Z" fill="white" />
        </svg>
    )
}
const CommentIcon = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 23 23" fill="none" {...props}>
            <path d="M9.54835e-06 11.5C9.54835e-06 5.14871 5.14872 0 11.5 0C17.8513 0 23 5.14871 23 11.5C23 17.8513 17.8513 23 11.5 23C9.55486 23 7.71979 22.5162 6.11144 21.6619L1.57058 22.9532C1.35954 23.013 1.13635 23.0154 0.924076 22.9601C0.711798 22.9049 0.518124 22.7939 0.363058 22.6388C0.207992 22.4836 0.0971558 22.2899 0.0419975 22.0776C-0.0131609 21.8653 -0.0106417 21.6421 0.0492952 21.4311L1.34058 16.891C0.457987 15.2313 -0.00241778 13.3798 9.54835e-06 11.5ZM6.57144 9.03571C6.57144 9.25357 6.65798 9.4625 6.81203 9.61655C6.96607 9.7706 7.17501 9.85714 7.39286 9.85714H15.6071C15.825 9.85714 16.0339 9.7706 16.188 9.61655C16.342 9.4625 16.4286 9.25357 16.4286 9.03571C16.4286 8.81786 16.342 8.60892 16.188 8.45488C16.0339 8.30083 15.825 8.21429 15.6071 8.21429H7.39286C7.17501 8.21429 6.96607 8.30083 6.81203 8.45488C6.65798 8.60892 6.57144 8.81786 6.57144 9.03571ZM7.39286 13.1429C7.17501 13.1429 6.96607 13.2294 6.81203 13.3834C6.65798 13.5375 6.57144 13.7464 6.57144 13.9643C6.57144 14.1821 6.65798 14.3911 6.81203 14.5451C6.96607 14.6992 7.17501 14.7857 7.39286 14.7857H12.3214C12.5393 14.7857 12.7482 14.6992 12.9023 14.5451C13.0563 14.3911 13.1429 14.1821 13.1429 13.9643C13.1429 13.7464 13.0563 13.5375 12.9023 13.3834C12.7482 13.2294 12.5393 13.1429 12.3214 13.1429H7.39286Z" fill="white" />
        </svg>
    )
}
const SummaryPanel = ({ summary = {}, rating = 0, review = {}, onDetailClick, BookIcon }) => {
    const quotedHtml = `&quot;${summary.quote || ""}&quot;`;
    return (
        <div className="summary-panel">
            <div className={styles["summary-blur-block"]}></div>
            <div className={styles["summary-quote-section"]}>
                <div dangerouslySetInnerHTML={{ __html: quotedHtml || "" }} className={styles["summary-quote"]} />
                {/* <div className={styles["summary-quote"]}>"{summary.quote || ''}"</div> */}
                <div className={styles["summary-row"]}>
                    <div className={styles["summary-rating"]}>
                        {[...Array(MAX_RATING)].map((_, idx) => (
                            <BookIcon className={styles["book-icon"]}
                                key={idx}
                                fill={idx < Math.round(rating) ? mainColor : grayColor}
                                style={{ marginRight: 2 }}
                            />
                        ))}
                        {/* <span className={styles[/"rating-emoji"]}>📖</span> */}
                        <span className={styles["rating-value"]}>{rating || 0}</span>
                        <span className={styles["summary-rating-max"]}> / 5</span>
                    </div>
                    <button className={styles["summary-detail-button"]} onClick={onDetailClick}>상세보기</button>
                </div>
            </div>
            <div className={styles["summary-review-wrapper"]}>
                <div className={styles["summary-review-blur-block"]}></div>
                <div className={styles["summary-review-meta"]}>
                    <div className={styles["summary-review-row"]}>
                        <div className={styles["summary-like-comment-row"]}>
                            {/* <div className={styles["summary-like"]}>❤️ {review.like || 0}</div> */}
                            <div className={styles["summary-like"]}>
                                <HeartIcon style={{ verticalAlign: "middle", marginRight: 4 }} />
                                {review.like || 0}
                            </div>
                            <div className={styles["summary-comment"]}>
                                <CommentIcon style={{ verticalAlign: "middle", marginRight: 4 }} />
                                {review.reviewCount || 0}
                            </div>
                            {/* <div className={styles["summary-comment"]}>💬 {review.reviewCount || 0}</div> */}
                        </div>
                        <div className={styles["summary-writer"]}>작성자
                            <span className={styles["summary-writer-data"]}>{review.writer || "-"}</span>
                        </div>
                    </div>

                    <div className={styles["summary-review-ment"]}>{review.reviewMent || ""}</div>
                </div>
            </div>
        </div>

    );
};

export default SummaryPanel;