// components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PretendardLight from "../assets/fonts/Pretendard-Light.ttf";

const BackButton = ({ label = "책 다시 검색" }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* 폰트 import 후 style 태그로 삽입 */}
      <style>
        {`
          @font-face {
            font-family: 'Pretendard-Light';
            src: url(${PretendardLight}) format('truetype');
            font-weight: 100;
            font-style: normal;
          }
        `}
      </style>
      <button
        onClick={() => navigate("/booksearch")}
        style={{
          backgroundColor: "transparent",
          background: "none",
          zIndex: "1",
          position: "fixed",
          zIndex: "1000",
          top: "4rem",
          left: "6.5rem",
          display: "flex",
          alignItems: "center",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          // width="17"
          // height="30"
          viewBox="0 0 17 30"
          fill="none"
          style={{
            marginRight: "1.5rem",
            strokeWidth: "1.7px",
            stroke: "#FFF",
            width: "14px",
            height: "28px",
            flexShrink: "0",
            background: "none",
          }}
        >
          <path d="M16 1L2 15L16 29" stroke="white" strokeWidth="1.7" fil="none" />
        </svg>
        <span
          style={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Pretendard-Light",
            fontSize: "15px",
            fontStyle: "normal",
            fontWeight: 100,
            lineHeight: "normal",
          }}
        >
          {label}
        </span>
      </button >
    </>
  );
};

export default BackButton;
