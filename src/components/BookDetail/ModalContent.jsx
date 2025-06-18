import React from "react";
import BookCover from "../BookCover";
import styles from "./ModalContent.module.css";

const ModalContent = ({ book, children }) => {
    if (!book) return <div>로딩 중...</div>;
    console.log(book)
    return (
        <div className={styles["modal-content"]}>
            <div className={styles["blur-background"]}></div>
            <div className={styles["content-wrapper"]}>
                <BookCover cover={book.cover} className={styles["book-cover"]} />
                {children}
            </div>
        </div>
    );
};

export default ModalContent;
