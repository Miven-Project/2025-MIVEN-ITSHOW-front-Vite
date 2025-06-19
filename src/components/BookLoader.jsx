// components/BookLoader.jsx
import React from "react";
import loaderIcon from "../assets/images/loader.gif";

const BookLoader = () => (
    <div className="book-loader">
        <style>{`
      .book-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
        width: 100%;
      }

      .book-loader img {
        width: 160px;
        height: 160px;
        object-fit: contain;
      }
    `}</style>

        <img src={loaderIcon} alt="로딩 중..." />
    </div>
);

export default BookLoader;
