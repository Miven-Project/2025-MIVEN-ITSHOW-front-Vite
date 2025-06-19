import React from 'react';
import MyPageHeader from "../components/MyPageHeader";
import MyPageBody from "../components/MyPageBody";


const MyPage = () => {
  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none; /* Webkit 기반 브라우저 스크롤바 숨김 */
        }
      `}</style>
      <MyPageHeader />
      <MyPageBody />
    </div>
  );
}
export default MyPage;