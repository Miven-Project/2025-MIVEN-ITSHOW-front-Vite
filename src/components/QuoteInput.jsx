import React from "react";
import styles from "../styles/BookInputPage.module.css";

const QuoteInput = ({ value, onChange }) => {
  return (
    <div className={styles["quote-input-area"]}>
      <textarea
        className={styles["quote-input"]}
        placeholder="'간직하고 싶은 인상 깊은 구절을 적정해 보세요'"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default QuoteInput;
