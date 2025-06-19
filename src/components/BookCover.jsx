import React from "react";
// import styles from "../styles/BookDetailPage.module.css";

const BookCover = ({ cover, className }) => {
    return (
        <img src={cover} alt="book cover" className={className} />
    );
};

export default BookCover;