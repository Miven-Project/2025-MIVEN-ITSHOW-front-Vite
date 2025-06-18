import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles/BookInputPage.module.css";
import BackButton from "../components/BackButton";
import bookIcon from "../assets/images/bookicon.png";
import PropTypes from 'prop-types';

const apiBaseUrl = "http://3.38.185.232:8080";

const EditBookPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gNo } = useParams();

  const book = state?.book;
  const existing = state?.existingData;

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
    quote: "",
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
        initializeFormWithData(result.data);
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

  // 폼 데이터 초기화 함수 (통합)
  const initializeFormWithData = (data) => {
    const dateRange = parsePeriodToDateRange(data.period);

    console.log("initializeFormWithData 호출:", {
      data,
      bookPublisher: book?.publisher,
      dataPublisher: data.publisher
    });

    setFormData({
      isbn: data.isbn || book?.isbn || "",
      publishDate: data.publicDate || (book?.pubdate ? formatPublishDate(book.pubdate) : ""),
      publisher: data.publisher || book?.publisher || "", // 우선순위: API 데이터 > 네이버 데이터
      readingStart: dateRange.start,
      readingEnd: dateRange.end,
      writer: data.writer || "",
      quote: data.quote || "",
      shortReview: data.reviewText || data.review || "",
    });

    setRating(data.rating || 0);
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
    };

    await patchGallery(galleryData);
  };

  // Effects
  useEffect(() => {
    console.log("초기 useEffect - gNo:", gNo, "existing:", existing, "book:", book);

    // gNo가 있으면 API에서 데이터 가져오기
    if (gNo) {
      fetchBookDetail(gNo);
    } else if (existing) {
      fetchBookDetail(existing.bookId);
      // existing 데이터로도 초기화 (API 호출과 별개로)
      initializeFormWithData(existing);
    }
  }, [gNo]);

  // 네이버 API 데이터로 출판사 정보 보완 (API 호출 완료 후)
  useEffect(() => {
    console.log("Publisher 보완 useEffect - book:", book, "formData.publisher:", formData.publisher);

    if (book?.publisher && !formData.publisher) {
      console.log("Publisher 업데이트:", book.publisher);
      setFormData(prev => ({
        ...prev,
        publisher: book.publisher
      }));
    }
  }, [book, formData.publisher]);

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
  // const cleanQuote = formData.quote?.replace(/<br\s*\/?>/gi, "\n") || "";

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
                    placeholder="출판사를 입력해주세요"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange("publisher", e.target.value)}
                  />
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
                //   {/* &quot;{cleanQuote || formData.quote}&quot;
                // </p> */}
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

EditBookPage.propTypes = {
  initialQuote: PropTypes.string.isRequired,
};

export default EditBookPage