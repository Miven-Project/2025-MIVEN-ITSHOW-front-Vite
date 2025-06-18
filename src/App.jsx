import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/fonts.css";
import MyPageHeader from "./components/MyPageHeader";
import { CoverColorProvider } from "./contexts/CoverColorContext";
import SelectBook from "./pages/SelectBook";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login"; //수정
import MyPage from "./pages/MyPage";
import BookDetailPage from "./pages/BookDetailPage";
import "./global.css";
import Home from "./pages/Home";
import BookGallery from "./pages/BookGallery";
import BookGalleryTest from "./pages/BookGalleryTest";
import BookSearch from "./pages/BookSearch";
import BookInputPage from "./pages/BookInputPage";

function App() {
  return (
    <CoverColorProvider>
      <Router>
        <Routes>
          <Route path="/selectbook" element={<SelectBook />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/BookGallery" element={<BookGallery />} />
          <Route path="/BookGalleryTest" element={<BookGalleryTest />} />
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* ★ 여기 login 경로 추가 */}
          <Route path="/booksearch" element={<BookSearch />} />
          <Route path="/bookinput" element={<BookInputPage />} />
          <Route path="/scroll" element={<BookDetailPage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/scroll" element={<BookDetailPage />} /> */}
          
          {/* 되야하는 동작 : gNo로 접근, ISBN으로 접근, 기본 bookId로 접근하는 세 가지 경로 지원 */}
          <Route path="/bookdetail/:bookId" element={<BookDetailPage />} />
          <Route path="/bookdetail/gno/:gNo" element={<BookDetailPage />} />
          <Route path="/bookdetail/isbn/:isbn" element={<BookDetailPage />} />
        </Routes>
      </Router>
    </CoverColorProvider>
  );
}

export default App;
