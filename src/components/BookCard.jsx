import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BookCard.module.css";

const BookCard = ({ id, image, title, author }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <img src={image} alt={title} className={styles.bookImage} />
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{title}</h3>
        <p className={styles.bookAuthor}>{author}</p>
      </div>
    </div>
  );
};

export default BookCard;
