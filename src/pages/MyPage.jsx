import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageHeader from "../components/MyPageHeader";
import MyPageBody from "../components/MyPageBody";

const MyPage = () => {
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    // 확인 대화상자 표시
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        // localStorage에서 토큰 제거
        localStorage.removeItem("authToken");
        
        // 기타 사용자 관련 데이터도 제거 (필요시)
        // localStorage.removeItem("userInfo");
        // localStorage.removeItem("userId");
        
        console.log("로그아웃 완료 - 토큰 제거됨");
        
        // 홈으로 이동
        navigate("/");
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
        position: "relative",
        paddingBottom: "20px", // 기본 여백
      }}
    >
      <style>{`
        div::-webkit-scrollbar {
          display: none; /* Webkit 기반 브라우저 스크롤바 숨김 */
        }
      `}</style>
      
      <MyPageHeader />
      <MyPageBody />
      
      {/* 로그아웃 버튼 */}
      <div 
        style={{
          position: "fixed",
          bottom: "30px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#ff4757",
            fontSize: "25px",
            fontWeight: "500",
            cursor: "pointer",
            padding: "28px 64px",
            transition: "opacity 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.7";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path 
              d="M16 17L21 12M21 12L16 7M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default MyPage;