import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/fonts.css";
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
import EditBookPage from "./pages/EditBookPage";

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
          <Route path="/booksearch" element={<BookSearch />} />
          <Route path="/bookinput" element={<BookInputPage />} />
          <Route path="/scroll" element={<BookDetailPage />} />
          <Route path="/editbookpage" element={<EditBookPage initialQuote="" />} />
          <Route path="/bookdetail/:bookId" element={<BookDetailPage />} />
          <Route path="/bookdetail/gno/:gNo" element={<BookDetailPage />} />
          <Route path="/bookdetail/isbn/:isbn" element={<BookDetailPage />} />
        </Routes>
      </Router>
    </CoverColorProvider>
  );
}

export default App;
