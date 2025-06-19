import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/BookInputPage.module.css";
import BackButton from "../components/BackButton";
import bookIcon from "../assets/images/bookicon.png";
import PropTypes from 'prop-types';

const apiBaseUrl = "https://leafin.mirim-it-show.site";

const EditBookPage = ({ initialQuote }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gNo } = useParams();

  const book = state?.book; // 네이버 API 데이터
  const existing = state?.existingData; // 갤러리 서버 데이터

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [formData, setFormData] = useState({
    isbn: "",
    publishDate: "",
    publisher: "",
    readingStart: "",
    readingEnd: "",
    writer: "",
    quote: initialQuote || "",
    shortReview: "",
  });

  // 유틸리티 함수들
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  const getPureToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("로그인이 필요합니다. 토큰이 없습니다.");
    return token.startsWith("Bearer ") ? token.slice(7) : token;
  };

  const getUserInfoFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        email: payload.sub,
        userId: payload.userId || payload.sub,
      };
    } catch {
      return null;
    }
  };

  const formatDateKR = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  const formatPublishDate = (rawDate) => {
    if (!rawDate) return "";

    // 이미 YYYY-MM-DD 형식이면 그대로 반환
    if (rawDate.includes("-") && rawDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return rawDate;
    }

    // YYYYMMDD 형식을 YYYY-MM-DD로 변환
    if (rawDate.length === 8 && /^\d{8}$/.test(rawDate)) {
      const year = rawDate.slice(0, 4);
      const month = rawDate.slice(4, 6);
      const day = rawDate.slice(6, 8);
      return `${year}-${month}-${day}`;
    }

    // "YYYY년 MM월 DD일" 형식을 YYYY-MM-DD로 변환
    const koreanDateMatch = rawDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
    if (koreanDateMatch) {
      const [, year, month, day] = koreanDateMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return rawDate;
  };

  const parsePeriodToDateRange = (period) => {
    if (!period) return { start: "", end: "" };

    const parts = period.split(" ~ ");
    if (parts.length !== 2) return { start: "", end: "" };

    const parseKoreanDate = (koreanDate) => {
      const match = koreanDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) {
        const [, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return "";
    };

    return {
      start: parseKoreanDate(parts[0]),
      end: parseKoreanDate(parts[1])
    };
  };

  // 🔥 localStorage에서 네이버 API 책 정보 가져오기 (ISBN 기반)
  const getNaverBookFromStorage = (isbn, title) => {
    try {
      // 1. ISBN 기반 네이버 책 데이터베이스에서 찾기
      if (isbn) {
        const naverDatabase = localStorage.getItem('naverBookDatabase');
        if (naverDatabase) {
          const database = JSON.parse(naverDatabase);
          if (database[isbn]) {
            console.log("✅ localStorage naverDatabase에서 찾은 책:", database[isbn]);
            return database[isbn];
          }
        }
      }
      
      // 2. 현재 책 정보에서 찾기
      const currentBook = localStorage.getItem('currentBook');
      if (currentBook) {
        const parsed = JSON.parse(currentBook);
        if (parsed.isbn === isbn || parsed.title === title) {
          console.log("✅ localStorage currentBook에서 찾은 책:", parsed);
          return parsed;
        }
      }
      
      console.log("❌ localStorage에서 네이버 책 데이터를 찾을 수 없음:", { isbn, title });
      return null;
    } catch (error) {
      console.error("localStorage 네이버 책 데이터 파싱 실패:", error);
      return null;
    }
  };

  // 🔥 실제 네이버 API에서 책 정보 가져오기 (BookSearch와 동일한 API 사용)
  const fetchBookFromNaverAPI = async (isbn, title) => {
    try {
      console.log("🔍 실제 네이버 API 호출 시작:", { isbn, title });
      
      // 검색 전략: ISBN이 있으면 ISBN으로, 없으면 title로 검색
      let searchQuery = "";
      let searchType = "";
      
      if (isbn && isbn !== "") {
        searchQuery = isbn;
        searchType = "ISBN";
      } else if (title && title !== "") {
        searchQuery = title;
        searchType = "제목";
      } else {
        console.log("❌ 검색할 ISBN이나 제목이 없습니다");
        return null;
      }
      
      console.log(`🔍 ${searchType}으로 검색: "${searchQuery}"`);
      
      const response = await fetch(`${apiBaseUrl}/api/naver/book?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`네이버 API 호출 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📚 네이버 API 응답:", data);
      
      if (data.items && data.items.length > 0) {
        let foundBook = null;
        
        if (searchType === "ISBN" && isbn) {
          // ISBN으로 검색한 경우 - ISBN이 정확히 일치하는 책 찾기
          foundBook = data.items.find(item => item.isbn === isbn);
          if (!foundBook) {
            // 정확히 일치하는 게 없으면 첫 번째 결과 사용
            foundBook = data.items[0];
            console.log("⚠️ ISBN 정확 매칭 실패, 첫 번째 결과 사용");
          }
        } else {
          // 제목으로 검색한 경우 - 제목이 가장 유사한 책 찾기
          if (title) {
            const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
            foundBook = data.items.find(item => {
              const itemTitle = item.title.replace(/<[^>]*>/g, '').trim();
              return itemTitle.includes(cleanTitle) || cleanTitle.includes(itemTitle);
            });
          }
          if (!foundBook) {
            foundBook = data.items[0];
          }
        }
        
        if (foundBook) {
          console.log("✅ 네이버 API에서 찾은 책 정보:", foundBook);
          
          // localStorage에 저장 (ISBN이 있는 경우만)
          if (foundBook.isbn && foundBook.publisher) {
            const existing = localStorage.getItem('naverBookDatabase');
            const database = existing ? JSON.parse(existing) : {};
            database[foundBook.isbn] = foundBook;
            localStorage.setItem('naverBookDatabase', JSON.stringify(database));
            console.log("💾 네이버 API 데이터를 localStorage에 저장:", foundBook);
          }
          
          return foundBook;
        }
      }
      
      console.log("❌ 네이버 API에서 책을 찾을 수 없음");
      return null;
      
    } catch (error) {
      console.error("❌ 네이버 API 호출 실패:", error);
      return null;
    }
  };

  // 🔥 임시 출판사 매핑 (하드코딩) - 확장 버전
  // 🔥 임시 출판사 매핑 (하드코딩) - 최소화 버전 (네이버 API로 찾을 수 없는 경우만)
  const getPublisherByTitle = (title) => {
    const publisherMap = {
      // 네이버 API에서 찾을 수 없는 특수한 경우들만 추가
      "급류 (정대건 장편소설)": "문학사상사",
      "여름비 (마르그리트 뒤라스 소설)": "미디어창비",
      // 필요한 경우에만 추가...
    };
    
    // 정확한 제목 매칭
    if (publisherMap[title]) {
      return publisherMap[title];
    }
    
    // 부분 매칭 (괄호 제거하고 검색)
    const titleWithoutParentheses = title.replace(/\s*\([^)]*\)/g, '').trim();
    for (const [mapTitle, publisher] of Object.entries(publisherMap)) {
      const mapTitleWithoutParentheses = mapTitle.replace(/\s*\([^)]*\)/g, '').trim();
      if (titleWithoutParentheses === mapTitleWithoutParentheses) {
        return publisher;
      }
    }
    
    return "";
  };

  // 🔥 출판사 찾기 함수 개선 (네이버 API 직접 호출 포함)
  const findPublisher = async (bookData, apiData) => {
    console.log("🔍 출판사 검색 시작:", { bookData, apiData });
    
    // 1순위: API 데이터의 publisher
    if (apiData?.publisher) {
      console.log("✅ 1순위: API 데이터에서 출판사 발견:", apiData.publisher);
      return apiData.publisher;
    }
    
    // 2순위: 네이버 API 책 데이터의 publisher (state.book)
    if (bookData?.publisher) {
      console.log("✅ 2순위: 네이버 API 데이터에서 출판사 발견:", bookData.publisher);
      return bookData.publisher;
    }
    
    // 3순위: localStorage의 네이버 API 데이터
    const currentBook = apiData || bookData;
    const naverBook = getNaverBookFromStorage(currentBook?.isbn, currentBook?.title);
    if (naverBook?.publisher) {
      console.log("✅ 3순위: localStorage에서 출판사 발견:", naverBook.publisher);
      return naverBook.publisher;
    }
    
    // 4순위: 네이버 API 직접 호출
    if (currentBook?.isbn || currentBook?.title) {
      console.log("🔍 4순위: 네이버 API 직접 호출 시도");
      const fetchedBook = await fetchBookFromNaverAPI(currentBook.isbn, currentBook.title);
      if (fetchedBook?.publisher) {
        console.log("✅ 4순위: 네이버 API 직접 호출에서 출판사 발견:", fetchedBook.publisher);
        return fetchedBook.publisher;
      }
    }
    
    // 5순위: 임시 출판사 매핑 (하드코딩)
    const titleBasedPublisher = getPublisherByTitle(apiData?.title || bookData?.title);
    if (titleBasedPublisher) {
      console.log("✅ 5순위: 하드코딩된 매핑에서 출판사 발견:", titleBasedPublisher);
      return titleBasedPublisher;
    }
    
    // 6순위: 다른 가능한 필드들 체크
    const possibleFields = ['publication', 'pub', 'publisherName', 'pubname'];
    for (const field of possibleFields) {
      if (apiData?.[field]) {
        console.log(`✅ 6순위: apiData.${field}에서 출판사 발견:`, apiData[field]);
        return apiData[field];
      }
      if (bookData?.[field]) {
        console.log(`✅ 6순위: bookData.${field}에서 출판사 발견:`, bookData[field]);
        return bookData[field];
      }
      if (naverBook?.[field]) {
        console.log(`✅ 6순위: naverBook.${field}에서 출판사 발견:`, naverBook[field]);
        return naverBook[field];
      }
    }
    
    console.log("❌ 모든 방법으로 출판사를 찾을 수 없음");
    return "";
  };

  // API 호출 함수들
  const fetchBookDetail = async (bookId) => {
    setIsDetailLoading(true);
    try {
      const authToken = getAuthToken();
      const response = await fetch(`${apiBaseUrl}/api/gallery/detail/${bookId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      });

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          localStorage.removeItem("authToken");
          throw new Error("토큰이 유효하지 않거나 인증이 필요합니다.");
        }
        throw new Error(`서버 오류 (${response.status}): ${await response.text()}`);
      }

      const result = await response.json();
      if (result.code === 200 && result.data) {
        setBookDetail(result.data);
        await initializeFormWithData(result.data); // 🔥 비동기 함수 호출
      } else {
        throw new Error(`응답 오류: ${result.message || "도서 정보를 불러올 수 없습니다."}`);
      }
    } catch (error) {
      console.error("도서 상세 정보 가져오기 실패:", error);
      alert(`도서 정보 로드 실패: ${error.message}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const patchGallery = async (galleryData) => {
    setIsLoading(true);
    try {
      const authToken = getAuthToken();
      const pureToken = getPureToken();
      const userInfo = getUserInfoFromToken(pureToken);
      if (!userInfo) throw new Error("사용자 정보를 토큰에서 추출할 수 없습니다.");

      const dataWithUser = {
        ...galleryData,
        userEmail: userInfo.email,
        userId: userInfo.userId,
      };

      const bookId = gNo || existing?.bookId || bookDetail?.id;
      if (!bookId) {
        throw new Error("업데이트할 도서 ID를 찾을 수 없습니다.");
      }

      const response = await fetch(`${apiBaseUrl}/api/gallery/update/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(dataWithUser),
      });

      if (!response.ok) {
        if ([401, 403].includes(response.status)) {
          throw new Error("토큰이 유효하지 않거나 인증이 필요합니다.");
        }
        throw new Error(`서버 오류 (${response.status}): ${await response.text()}`);
      }

      const result = await response.json();
      if (result.code === 200) {
        const bookTitle = (book || bookDetail)?.title || "도서";
        alert(`"${bookTitle}" 도서 정보가 수정되었습니다!`);
        navigate("/selectbook");
      } else {
        throw new Error(`응답 오류: ${result.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      alert(`수정 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 폼 데이터 초기화 함수 개선 (비동기)
  const initializeFormWithData = async (data) => {
    console.log("=== initializeFormWithData 호출 ===");
    console.log("📊 API data:", data);
    console.log("📚 book data (네이버 API):", book);
    
    const dateRange = parsePeriodToDateRange(data.period);
    
    // 🔥 출판사 정보 찾기 (비동기 - 네이버 API 직접 호출 포함)
    const publisher = await findPublisher(book, data);
    console.log("🎯 최종 선택된 publisher:", publisher);

    setFormData(prev => ({
      ...prev,
      isbn: data.isbn || book?.isbn || "",
      publishDate: data.publicDate ? formatPublishDate(data.publicDate) : (book?.pubdate ? formatPublishDate(book.pubdate) : ""),
      publisher: publisher, // 🔥 개선된 출판사 찾기 로직 사용
      readingStart: dateRange.start,
      readingEnd: dateRange.end,
      writer: data.writer || "",
      quote: data.quote || "",
      shortReview: data.reviewText || data.review || "",
    }));

    setRating(data.rating || 0);
  };

  // 🔥 초기 데이터 설정 함수 개선 (비동기)
  const setInitialBookData = async () => {
    const currentBook = book; // state.book (네이버 API 데이터)
    
    if (currentBook) {
      console.log("=== 초기 book 데이터 설정 ===");
      console.log("📚 사용할 book (네이버 API 데이터):", currentBook);
      
      setFormData(prev => ({
        ...prev,
        isbn: currentBook.isbn || "",
        publishDate: currentBook.pubdate ? formatPublishDate(currentBook.pubdate) : "",
        publisher: currentBook.publisher || "",
      }));
    } else {
      // book이 없으면 localStorage에서 찾거나 네이버 API 호출
      const existingBook = existing || bookDetail;
      if (existingBook?.isbn || existingBook?.title) {
        console.log("=== 네이버 API 데이터 검색 시작 ===");
        
        // localStorage에서 먼저 찾기
        const naverBook = getNaverBookFromStorage(existingBook.isbn, existingBook.title);
        if (naverBook) {
          console.log("✅ localStorage에서 네이버 API 데이터 찾음:", naverBook);
          
          setFormData(prev => ({
            ...prev,
            isbn: naverBook.isbn || "",
            publishDate: naverBook.pubdate ? formatPublishDate(naverBook.pubdate) : "",
            publisher: naverBook.publisher || "",
          }));
        } else {
          // localStorage에 없으면 네이버 API 직접 호출
          console.log("🔍 localStorage에 없음, 네이버 API 직접 호출");
          const fetchedBook = await fetchBookFromNaverAPI(existingBook.isbn, existingBook.title);
          if (fetchedBook) {
            console.log("✅ 네이버 API에서 책 정보 가져옴:", fetchedBook);
            
            setFormData(prev => ({
              ...prev,
              isbn: fetchedBook.isbn || "",
              publishDate: fetchedBook.pubdate ? formatPublishDate(fetchedBook.pubdate) : "",
              publisher: fetchedBook.publisher || "",
            }));
          } else {
            // 네이버 API에서도 못 찾으면 하드코딩된 매핑 사용
            const publisher = getPublisherByTitle(existingBook.title);
            if (publisher) {
              console.log("✅ 하드코딩된 매핑에서 출판사 찾음:", publisher);
              setFormData(prev => ({
                ...prev,
                publisher: publisher,
              }));
            }
          }
        }
      }
    }
  };

  // 이벤트 핸들러들
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const validateForm = () => {
    if (rating === 0) {
      alert("평점을 선택해주세요.");
      return false;
    }
    if (!formData.readingStart || !formData.readingEnd) {
      alert("독서 시작 및 완료 날짜를 입력해주세요.");
      return false;
    }
    if (new Date(formData.readingStart) > new Date(formData.readingEnd)) {
      alert("시작 날짜는 완료 날짜보다 이전이어야 합니다.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    try {
      getAuthToken();
    } catch (error) {
      alert(error.message);
      return;
    }

    if (!validateForm()) return;

    const currentBook = book || bookDetail;
    const galleryData = {
      bookId: gNo || existing?.bookId || bookDetail?.id,
      title: currentBook?.title,
      cover: currentBook?.image || currentBook?.cover,
      isbn: formData.isbn,
      publicDate: formatPublishDate(formData.publishDate),
      period: `${formatDateKR(formData.readingStart)} ~ ${formatDateKR(formData.readingEnd)}`,
      rating,
      review: formData.shortReview,
      quote: formData.quote,
      pages: currentBook?.pages || 0,
      writer: formData.writer,
      publisher: formData.publisher, // 🔥 출판사 정보 포함
    };

    await patchGallery(galleryData);
  };

  // Effects
  useEffect(() => {
    const initializeData = async () => {
      console.log("=== EditBookPage 초기 mount ===");
      console.log("🗃️ state 전체:", state);
      console.log("📚 state.book (네이버 API 데이터):", state?.book);
      console.log("📊 state.existingData (갤러리 서버 데이터):", state?.existingData);
      console.log("book:", book);
      console.log("existing:", existing);
      console.log("gNo:", gNo);
      
      // 🔥 state.book의 모든 필드 확인
      if (state?.book) {
        console.log("=== state.book 상세 분석 (네이버 API 데이터) ===");
        console.log("📋 state.book 전체 객체:", JSON.stringify(state.book, null, 2));
        console.log("🔑 state.book의 모든 키:", Object.keys(state.book));
        console.log("🏢 state.book.publisher:", state.book.publisher);
        console.log("✅ 네이버 API 데이터에서 출판사를 가져올 수 있습니다!");
      } else {
        console.log("❌ state.book이 존재하지 않습니다!");
        console.log("🔍 localStorage 또는 네이버 API에서 데이터를 찾아야 합니다.");
      }
      
      // 🔥 먼저 book 데이터가 있으면 기본값 설정 (비동기)
      await setInitialBookData();
      
      // gNo나 existing이 있으면 API 호출
      if (gNo) {
        await fetchBookDetail(gNo);
      } else if (existing?.bookId) {
        await fetchBookDetail(existing.bookId);
      } else if (existing) {
        // existing 데이터로도 초기화 (API 호출과 별개로)
        await initializeFormWithData(existing);
      }
    };
    
    initializeData();
  }, []);

  // 🔥 book이 나중에 로드되는 경우 처리
  useEffect(() => {
    const handleLateBookData = async () => {
      if (book && (!formData.isbn && !formData.publisher)) {
        console.log("=== book 데이터 나중에 로드됨 ===");
        await setInitialBookData();
      }
    };
    
    handleLateBookData();
  }, [book]);

  // 🔥 디버깅용 useEffect
  useEffect(() => {
    console.log("=== formData 변경됨 ===");
    console.log("📝 formData:", formData);
  }, [formData]);

  // 로딩 상태 처리
  if (isDetailLoading) {
    return (
      <div className={styles.container}>
        <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          책 정보를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (!book && !bookDetail) {
    return (
      <div className={styles.container}>
        <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
          책 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const currentBook = book || bookDetail;
  const bookImage = currentBook?.image || currentBook?.cover;
  const bookTitle = currentBook?.title || "제목 없음";
  const quotedHtml = `&quot;${formData.quote || ""}&quot;`;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${bookImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={styles.blurOverlay}></div>
      <BackButton />
      <div className={styles["page-title"]}>{bookTitle} (수정)</div>
      <div className={styles["page-content-wrapper"]}>
        <div className={styles["modal-content"]}>
          <div className={styles["blur-background"]}></div>
          <div className={styles["content-wrapper"]}>
            <div className={styles["book-cover-section"]}>
              <img
                src={bookImage}
                alt={bookTitle}
                className={styles["book-cover"]}
              />
            </div>

            <div className={styles["info-panel"]}>
              <div className={styles["section-title"]}>기본정보</div>
              <div className={styles["section-block"]}>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>ISBN</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="ISBN을 입력해주세요"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>발행(출간)일자</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="YYYYMMDD 또는 YYYY-MM-DD"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange("publishDate", e.target.value)}
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>출판사</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="출판사를 입력해주세요 (예: 민음사, 문학동네 등)"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange("publisher", e.target.value)}
                    style={{ 
                      backgroundColor: !formData.publisher ? "#fff3cd" : "",
                      border: !formData.publisher ? "2px solid #ffeaa7" : ""
                    }}
                  />
                  {/* 🔥 출판사 정보 상태 표시 */}
                  
                
                </div>
              </div>

              <div className={styles["section-title"]}>독서</div>
              <div className={styles["section-block"]}>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>시작 날짜 *</span>
                  <input
                    type="date"
                    className={styles["info-input"]}
                    value={formData.readingStart}
                    onChange={(e) => handleInputChange("readingStart", e.target.value)}
                    required
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>끝난 날짜 *</span>
                  <input
                    type="date"
                    className={styles["info-input"]}
                    value={formData.readingEnd}
                    onChange={(e) => handleInputChange("readingEnd", e.target.value)}
                    min={formData.readingStart}
                    required
                  />
                </div>
                <div className={styles["info-item"]}>
                  <span className={styles["info-label"]}>작성자</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="작성자를 입력해주세요 (선택사항)"
                    value={formData.writer}
                    onChange={(e) => handleInputChange("writer", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles["section-title"]}>리뷰</div>
              <div className={styles["rating-section"]}>
                <div className={styles["rating-title"]}>{formData.writer || "작성자"}님의 평점*</div>
                <div className={styles["rating-stars"]}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <img
                      key={value}
                      src={bookIcon}
                      alt="book rating"
                      className={`${styles.star} ${rating >= value ? styles.active : ""}`}
                      onClick={() => handleRating(value)}
                    />
                  ))}
                  <span className={styles["rating-value"]}>{rating}</span>
                  <input
                    type="text"
                    className={styles["info-input"]}
                    placeholder="한줄 소감을 작성해 주세요"
                    value={formData.shortReview}
                    onChange={(e) => handleInputChange("shortReview", e.target.value)}
                    style={{ marginLeft: "10px", width: "180px" }}
                  />
                </div>
              </div>

              <button
                onClick={handleUpdate}
                className={styles["save-button"]}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "수정중..." : "수정하기"}
              </button>
            </div>
          </div>

          <div className={styles["right-section"]}>
            <div className={styles["quote-text"]}></div>
            <div className={styles["quote-input-area"]}>
              {isEditing ? (
                <textarea
                  value={formData.quote}
                  className={styles["quote-input"]}
                  onChange={(e) => handleInputChange("quote", e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  rows={6}
                />
              ) : (
                <p
                  className={styles["quote-input"]}
                  onClick={() => setIsEditing(true)}
                  dangerouslySetInnerHTML={{ __html: quotedHtml }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EditBookPage.propTypes = {
  initialQuote: PropTypes.string,
};

EditBookPage.defaultProps = {
  initialQuote: "",
};

export default EditBookPage;