import MyPageHeader from "../components/MyPageHeader";
import MyPageBody from "../components/MyPageBody";

export default function MyPage() {
  return (
    <div
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
        overflowX: "hidden", // 수평 스크롤 숨김
        overflowY: "auto", // 수직 스크롤 허용
        height: "100vh", // 전체 화면 높이로 설정해야 스크롤 작동
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
