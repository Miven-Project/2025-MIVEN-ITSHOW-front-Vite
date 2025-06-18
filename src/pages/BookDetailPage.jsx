// BookDetailPage.jsx - 에러 수정 버전
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useParams, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import ModalContent from "../components/BookDetail/ModalContent";
import BoldText from "../components/BoldText";
import BookCover from "../components/BookCover"
import styles from "../styles/BookDetailPage.module.css";
import BlurredBackground from "../components/BookDetail/BlurredBackground";
import { BookDetailRightPanel } from "../components/BookDetail/BookDetailRightPanel";
import bookDetailReview from "../styles/BookDetailReview.module.css"
import PropTypes from 'prop-types';

const apiBaseUrl = "https://leafin.mirim-it-show.site";


const HeartIcon = ({ filled, onClick }) => {
    return (
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
            {filled ? (
                <AiFillHeart style={{ color: 'red', fontSize: '26px', fill: 'white' }} />
            ) : (
                <AiOutlineHeart style={{ fontSize: '26px', fill: 'white' }} />
            )}
        </div>
    );
};
HeartIcon.propTypes = {
    filled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

// 🔥 추가: 서버에 좋아요 상태 저장하는 함수
const updateLikeOnServer = async (reviewId, isLiked) => {
    const token = getAuthToken();
    if (!token) {
        console.error("인증 토큰이 없습니다.");
        return false;
    }

    try {
        // reviewId에서 bookId 추출 (형식: "작성자-bookId")
        const bookId = reviewId.split('-').pop();

        console.log(`서버에 좋아요 ${isLiked ? '추가' : '제거'} 요청:`, {
            bookId,
            reviewId,
            isLiked
        });

        // 좋아요 추가/제거 API 호출
        const response = await axios.post(
            `${apiBaseUrl}/api/gallery/${bookId}/like`,
            {
                liked: isLiked // 좋아요 상태
            },
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("서버 응답:", response.data);

        if (response.data.code === 200) {
            console.log(`좋아요 ${isLiked ? '추가' : '제거'} 성공`);
            return true;
        } else {
            console.error("서버 응답 에러:", response.data.message);
            return false;
        }
    } catch (error) {
        console.error("좋아요 서버 저장 실패:", error);

        // 에러 상세 정보 출력
        if (error.response) {
            console.error("응답 에러:", error.response.data);
            console.error("상태 코드:", error.response.status);
        } else if (error.request) {
            console.error("요청 에러:", error.request);
        } else {
            console.error("설정 에러:", error.message);
        }

        return false;
    }
};

// 🔥 추가: 사용자별 좋아요한 리뷰 목록 조회
const fetchUserLikedReviews = async () => {
    const token = getAuthToken();
    if (!token) return [];

    try {
        const response = await axios.get(
            `${apiBaseUrl}/api/user/liked-reviews`,
            {
                headers: { Authorization: token }
            }
        );

        if (response.data.code === 200 && response.data.data) {
            return response.data.data.likedReviews || [];
        }
        return [];
    } catch (error) {
        console.error("좋아요한 리뷰 목록 조회 실패:", error);
        return [];
    }
};


const ReviewCard = ({ quote, comment, writer, className, style, sectionType, likeCount = 0, onLikeClick, reviewId, isLiked: initialLiked = false }) => {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);

    const quoteSectionStyle = {
        height: sectionType === 'my-review' ? '335px' : '500px',
        padding: sectionType === 'my-review' ? '100px' : '50px'
    };

    const handleHeartClick = async () => {
        if (sectionType === 'reviews') {
            const newLikedState = !isLiked;

            try {
                // 🔥 서버에 좋아요 상태 저장
                const success = await updateLikeOnServer(reviewId, newLikedState);

                if (success) {
                    // 서버 저장 성공 시에만 UI 업데이트
                    setIsLiked(newLikedState);
                    setCurrentLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

                    if (onLikeClick) {
                        onLikeClick(newLikedState, reviewId, newLikedState ? currentLikeCount + 1 : currentLikeCount - 1);
                    }
                } else {
                    // 서버 저장 실패 시 에러 메시지 표시
                    console.error("좋아요 저장에 실패했습니다.");
                    alert("좋아요 저장에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (error) {
                console.error("좋아요 처리 중 오류:", error);
                alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
            }
        }
    };
    const quotedHtml = `&quot;${quote || ""}&quot;`;
    return (
        <div className={className} style={style}>
            {quote && quote !== "" ? (
                <div className={bookDetailReview["quote-section"]} style={quoteSectionStyle}>
                    <p dangerouslySetInnerHTML={{ __html: quotedHtml }} className={bookDetailReview["quote-text"]} />
                </div>
            ) : (
                <div className={bookDetailReview["quote-section"]} style={quoteSectionStyle}>
                    <p className={bookDetailReview["quote-text"]}>아직 등록된 구절이 없습니다.</p>
                </div>
            )}

            {comment && writer ? (
                <div className={bookDetailReview["comment-section"]}>
                    <p className={bookDetailReview["comment-text"]}>{comment}</p>
                    <div className={bookDetailReview["like-writer-wrapper"]}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <HeartIcon
                                filled={isLiked}
                                onClick={handleHeartClick}
                                style={{
                                    cursor: sectionType === 'reviews' ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    fill: 'white'
                                }}
                            />
                            <span style={{ fontSize: '14px' }}>
                                {currentLikeCount}
                            </span>
                        </div>
                        <span className={bookDetailReview["writer-name"]}>작성자 {writer}</span>
                    </div>
                </div>
            ) : (
                <div className={bookDetailReview["comment-section"]}>
                    <p className={bookDetailReview["comment-text"]}>아직 리뷰가 작성되지 않았습니다.</p>
                    <div className={bookDetailReview["like-writer-wrapper"]}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <HeartIcon
                                filled={false}
                                onClick={() => { }}
                                style={{
                                    cursor: 'default',
                                    transition: 'all 0.2s ease',
                                    fill: 'white'
                                }}
                            />
                            <span style={{ fontSize: '14px' }}>0</span>
                        </div>
                        <span className={bookDetailReview["writer-name"]}>작성자 -</span>
                    </div>
                </div>
            )}
        </div>
    )
};

ReviewCard.propTypes = {
    quote: PropTypes.string,
    comment: PropTypes.string,
    writer: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    sectionType: PropTypes.oneOf(['my-review', 'reviews']),
    likeCount: PropTypes.number,
    onLikeClick: PropTypes.func,
    reviewId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isLiked: PropTypes.bool,
};

// 🔥 수정: ReviewSection 컴포넌트의 onLikeClick 파라미터 수정
const ReviewSection = ({ title, reviews, isScrollable, sectionType, onLikeClick, likedReviews }) => {
    const sectionClass = sectionType === 'my-review'
        ? bookDetailReview["my-review"] : bookDetailReview["reviews"];

    return (
        <div className={sectionClass}>
            <div className={bookDetailReview["section-header"]}>
                <h3 className={bookDetailReview["section-title"]}>{title}</h3>
                {title === "Review" && (
                    <p className={bookDetailReview["section-description"]}>
                        :  마음에 드는 구절을 담은 사람의 글에 마음을 표시해봐요
                    </p>
                )}
            </div>
            {isScrollable ? (
                reviews.length === 0 ? (
                    <p className={bookDetailReview["no-review"]}>아직 등록된 리뷰가 없어요.</p>
                ) : (
                    <div className={bookDetailReview["reviews-container"]}>
                        {reviews.map((review, index) => (
                            <ReviewCard
                                key={index}
                                quote={review.quote}
                                comment={review.comment}
                                writer={review.writer}
                                className={bookDetailReview["review-box"]}
                                sectionType={sectionType}
                                likeCount={review.likeCount || 0} // 🔥 수정: 리뷰별 좋아요 수 전달
                                reviewId={review.reviewId || `${review.writer}-${index}`}
                                isLiked={likedReviews?.includes(review.reviewId || `${review.writer}-${index}`) || false}
                                onLikeClick={onLikeClick} // 🔥
                            />
                        ))}
                    </div>
                )
            ) : (
                <ReviewCard
                    quote={reviews[0]?.quote || ""}
                    comment={reviews[0]?.comment || ""}
                    writer={reviews[0]?.writer || ""}
                    className={bookDetailReview["my-review-box"]}
                    sectionType={sectionType}
                />
            )}
        </div>
    );
};
ReviewSection.propTypes = {
    title: PropTypes.string,
    reviews: PropTypes.array,
    isScrollable: PropTypes.bool,
    sectionType: PropTypes.string,
    onLikeClick: PropTypes.func,
    likedReviews: PropTypes.array.isRequired,
};
const stripHtml = (text) => text?.replace(/<[^>]*>/g, "") || "";

// 🔥 수정된 부분: 서버 API에서 현재 로그인한 사용자 정보 가져오기
const getCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
        console.error("인증 토큰이 없습니다.");
        return { username: "guest" }; // 토큰이 없으면 기본값 반환
    }

    try {
        const response = await axios.get(`${apiBaseUrl}/api/profile`, {
            headers: { Authorization: token }
        });

        if (response.data.code === 200 && response.data.data) {
            console.log("사용자 프로필 API 응답:", response.data);
            return {
                username: response.data.data.name,
                profileImg: response.data.data.profileImg,
                coverColor: response.data.data.coverColor,
                quoteCount: response.data.data.quoteCount,
                quote: response.data.data.quote,
                music: response.data.data.music
            };
        } else {
            console.error("프로필 API 에러:", response.data.message);
            return { username: "unknown" };
        }
    } catch (error) {
        console.error("사용자 프로필 가져오기 실패:", error);
        // API 호출 실패 시 localStorage에서 백업 정보 시도
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                return { username: parsed.username || "unknown" };
            } catch (e) {
                console.error("localStorage 사용자 정보 파싱 실패:", e);
            }
        }
        return { username: "unknown" };
    }
};


// 리뷰 데이터를 현재 사용자 기준으로 분리하는 함수
const separateReviewsByUser = (allReviews, currentUsername) => {
    const myReviews = [];
    const othersReviews = [];

    allReviews.forEach(review => {
        if (review.writer === currentUsername) {
            myReviews.push(review);
        } else {
            othersReviews.push(review);
        }
    });

    return { myReviews, othersReviews };
};

const mapToBookData = (data, originalBook = {}, allReviews = []) => {
    const title = stripHtml(data.title) || stripHtml(originalBook.title);
    const author = data.author || stripHtml(originalBook.author);
    const isbn = data.isbn || originalBook.isbn;
    const publisher = data.publisher || originalBook.publisher || "";
    const publishDate = data.publicDate || originalBook.pubdate;
    const reviewText = data.reviewText || "";
    const quote = data.quote || "";
    const writer = data.writer || "";
    const likeCount = data.likeCount || 0;
    const comments = Array.isArray(data.comments?.comments) ? data.comments.comments : [];

    // 전체 리뷰 수 계산 (내 리뷰 + 다른 사용자 리뷰)
    const totalReviewCount = allReviews.length;

    return {
        title,
        cover: data.cover || originalBook.image,
        rating: data.rating || 0,
        reviewText,
        quote,
        writer,
        comments,
        author,
        subtitle: isbn || "",
        info: {
            isbn,
            publishDate,
            publisher,
            pages: data.pages || 0,
            period: data.period || ""
        },
        reading: {
            regTime: data.regTime || new Date().toISOString(),
            period: data.period || ""
        },
        summary: {
            quote
        },
        review: {
            like: likeCount,
            reviewCount: totalReviewCount,
            writer,
            reviewMent: reviewText
        },
        reviewDetail: {
            likeCount,
            text: reviewText,
            comment: reviewText
        },
        allReviews: comments.map(comment => ({
            quote: comment.quote || "",
            comment: comment.text || comment.comment || "",
            writer: comment.writer || "",
            likeCount: comment.likeCount || 0
        }))
    };
};

// 인증 토큰 가져오기 함수
const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

// 같은 제목의 모든 리뷰 데이터 가져오기
const fetchAllReviewsForBook = async (bookTitle) => {
    const token = getAuthToken();
    if (!token) return [];

    try {
        const res = await axios.get(`${apiBaseUrl}/api/gallery/list`, {
            params: { keyword: " " },
            headers: { Authorization: token }
        });

        if (res.data.code === 200 && res.data.data?.books) {
            const books = res.data.data.books;

            // 같은 제목의 모든 책 찾기
            const matchingBooks = books.filter(book => {
                const serverTitle = stripHtml(book.title).trim();
                const searchTitle = stripHtml(bookTitle).trim();
                return serverTitle === searchTitle;
            });

            console.log(`"${bookTitle}" 제목의 모든 책들:`, matchingBooks);

            // 각 책에 대해 상세 정보 가져와서 리뷰 수집
            const allReviews = [];
            for (const book of matchingBooks) {
                try {
                    const detailRes = await axios.get(`${apiBaseUrl}/api/gallery/detail/${book.bookId}`, {
                        headers: { Authorization: token }
                    });

                    if (detailRes.data.code === 200 && detailRes.data.data) {
                        const detailData = detailRes.data.data;
                        allReviews.push({
                            quote: detailData.quote || "",
                            comment: detailData.reviewText || "",
                            writer: detailData.writer || "",
                            likeCount: detailData.likeCount || 0,
                            bookId: book.bookId,
                            reviewId: `${detailData.writer || 'unknown'}-${book.bookId}`
                        });
                    }
                } catch (error) {
                    console.error(`책 ID ${book.bookId} 상세 정보 가져오기 실패:`, error);
                }
            }

            console.log(`수집된 모든 리뷰:`, allReviews);
            return allReviews;
        }
        return [];
    } catch (error) {
        console.error("모든 리뷰 가져오기 실패:", error);
        return [];
    }
};

// 서버에서 책 상세 정보 가져오기
const fetchServerBookDetail = async (gNo) => {
    const token = getAuthToken();
    if (!token) throw new Error("인증 토큰이 없습니다.");

    try {
        const res = await axios.get(`${apiBaseUrl}/api/gallery/detail/${gNo}`, {
            headers: { Authorization: token }
        });

        if (res.data.code === 200) {
            return res.data.data;
        } else {
            throw new Error(`API 에러: ${res.data.message}`);
        }
    } catch (error) {
        console.error("상세 정보 요청 실패:", error);
        throw error;
    }
};

// ISBN으로 bookId(gNo) 찾기
const fetchBookIdByISBN = async (targetIsbn) => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const res = await axios.get(`${apiBaseUrl}/api/gallery/list`, {
            params: { keyword: " " },
            headers: { Authorization: token }
        });

        if (res.data.code === 200 && res.data.data?.books) {
            const books = res.data.data.books;
            const matching = books.find(book => book.isbn === targetIsbn);
            return matching?.bookId || null;
        }
        return null;
    } catch (err) {
        console.error("bookId 찾기 실패:", err);
        return null;
    }
};

// 제목으로 bookId(gNo) 찾기
const fetchBookIdByTitle = async (title) => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const res = await axios.get(`${apiBaseUrl}/api/gallery/list`, {
            params: { keyword: " " },
            headers: { Authorization: token }
        });

        if (res.data.code === 200 && res.data.data?.books) {
            const books = res.data.data.books;
            const matching = books.find(book => {
                const serverTitle = stripHtml(book.title).trim();
                const searchTitle = stripHtml(title).trim();
                return serverTitle === searchTitle;
            });
            return matching?.bookId || null;
        }
        return null;
    } catch (err) {
        console.error("제목으로 bookId 찾기 실패:", err);
        return null;
    }
};

const BookDetailPage = () => {
    const { bookId, gNo, isbn } = useParams();
    const location = useLocation();
    const bookFromState = location.state?.book;
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backgroundFixed, setBackgroundFixed] = useState(true);
    const [gradientOpacity, setGradientOpacity] = useState(0.3);
    const [myReviews, setMyReviews] = useState([]);
    const [othersReviews, setOthersReviews] = useState([]);
    // 하트를 누른 리뷰들과 총 하트 수 상태 관리
    const [likedReviews, setLikedReviews] = useState([]);
    const [totalLikeCount, setTotalLikeCount] = useState(0);
    const [setAllReviews] = useState([]);

    console.log("URL 파라미터 - bookId:", bookId, "gNo:", gNo, "isbn:", isbn);
    console.log("state로 전달받은 book:", bookFromState);

    // 🔥 하트 클릭 핸들러
    const handleLikeUpdate = (isLiked, reviewId, newLikeCount) => {
        console.log(`리뷰 ${reviewId} 하트 상태 변경: ${isLiked ? '좋아요' : '좋아요 취소'}, 새 하트 수: ${newLikeCount}`);

        // 좋아요한 리뷰 목록 업데이트
        setLikedReviews(prev => {
            if (isLiked) {
                return [...prev, reviewId];
            } else {
                return prev.filter(id => id !== reviewId);
            }
        });

        // 전체 하트 수 업데이트
        setTotalLikeCount(prev => isLiked ? prev + 1 : prev - 1);

        // bookData의 review.like 값도 실시간 업데이트
        setBookData(prevData => ({
            ...prevData,
            review: {
                ...prevData.review,
                like: isLiked ? prevData.review.like + 1 : prevData.review.like - 1
            }
        }));
    };

    useEffect(() => {
        const loadBookDetail = async () => {
            setLoading(true);
            setError(null);

            try {
                let finalGNo = null;
                let bookTitle = null;

                // 경우별 gNo 결정 로직
                if (gNo) {
                    finalGNo = gNo;
                    console.log("gNo로 직접 접근:", finalGNo);
                } else if (bookId) {
                    finalGNo = bookId;
                    console.log("bookId로 접근:", finalGNo);
                } else if (isbn) {
                    if (isbn.startsWith('temp-')) {
                        if (bookFromState?.title) {
                            finalGNo = await fetchBookIdByTitle(bookFromState.title);
                            console.log("제목으로 찾은 gNo:", finalGNo);
                        }
                    } else {
                        finalGNo = await fetchBookIdByISBN(isbn);
                        console.log("ISBN으로 찾은 gNo:", finalGNo);
                    }
                }

                if (finalGNo) {
                    // 서버에서 상세 정보 가져오기
                    console.log("서버에서 상세 정보 조회 시작, gNo:", finalGNo);
                    const detailData = await fetchServerBookDetail(finalGNo);

                    if (detailData) {
                        console.log("서버에서 받은 상세 데이터:", detailData);

                        bookTitle = stripHtml(detailData.title) || stripHtml(bookFromState?.title);
                        const allReviewsData = await fetchAllReviewsForBook(bookTitle);

                        const mapped = mapToBookData(detailData, bookFromState, allReviewsData);
                        console.log("매핑된 최종 데이터:", mapped);

                        // 🔥 수정: 변수명 통일 (allReviewsData -> allReviews)
                        const currentUser = await getCurrentUser();
                        console.log("현재 사용자 정보:", currentUser);

                        // 🔥 추가: 사용자가 좋아요한 리뷰 목록 가져오기
                        const userLikedReviews = await fetchUserLikedReviews();
                        console.log("사용자가 좋아요한 리뷰 목록:", userLikedReviews);
                        setLikedReviews(userLikedReviews);

                        const { myReviews: userReviews, othersReviews: otherReviews } =
                            separateReviewsByUser(allReviewsData, currentUser.username);

                        console.log("내 리뷰:", userReviews);
                        console.log("다른 사용자 리뷰:", otherReviews);

                        // 전체 하트 수 계산
                        const initialTotalLikes = allReviewsData.reduce((sum, review) => sum + (review.likeCount || 0), 0);
                        setTotalLikeCount(initialTotalLikes);
                        setAllReviews(allReviewsData);
                        setMyReviews(userReviews);
                        setOthersReviews(otherReviews);
                        setBookData(mapped);
                    } else {
                        throw new Error("서버에서 상세 정보를 가져올 수 없습니다.");
                    }
                } else {
                    // gNo를 찾을 수 없는 경우 기본 데이터 사용
                    console.log("gNo를 찾을 수 없어 기본 데이터 사용");
                    if (bookFromState) {
                        // 기본 데이터의 경우에도 같은 제목의 리뷰 검색
                        if (bookFromState.title) {
                            const allReviewsData = await fetchAllReviewsForBook(bookFromState.title); // 🔥 수정: 올바른 변수명 사용
                            const mapped = mapToBookData({}, bookFromState, allReviewsData);

                            const currentUser = await getCurrentUser();

                            // 🔥 추가: 사용자가 좋아요한 리뷰 목록 가져오기
                            const userLikedReviews = await fetchUserLikedReviews();
                            console.log("사용자가 좋아요한 리뷰 목록:", userLikedReviews);
                            setLikedReviews(userLikedReviews);

                            const { myReviews: userReviews, othersReviews: otherReviews } =
                                separateReviewsByUser(allReviewsData, currentUser.username); // 🔥 수정: 올바른 변수명 사용

                            // 전체 하트 수 계산
                            const initialTotalLikes = allReviewsData.reduce((sum, review) => sum + (review.likeCount || 0), 0);
                            setTotalLikeCount(initialTotalLikes);
                            setAllReviews(allReviewsData);
                            setMyReviews(userReviews);
                            setOthersReviews(otherReviews);
                            setBookData(mapped);
                        } else {
                            const mapped = mapToBookData({}, bookFromState, []);
                            setBookData(mapped);
                        }
                    } else {
                        const mapped = mapToBookData({}, bookFromState, []);
                        setBookData(mapped);
                        throw new Error("책 정보를 찾을 수 없습니다.");
                    }
                }
            } catch (err) {
                console.error("책 상세 정보 불러오기 실패:", err);
                setError(err.message || "서버 요청 중 문제가 발생했습니다.");

                // 에러 발생 시에도 기본 데이터가 있으면 표시
                if (bookFromState) {
                    const mapped = mapToBookData({}, bookFromState, []);
                    setBookData(mapped);
                    setError(null);
                }
            } finally {
                setLoading(false);
            }
        };

        loadBookDetail();
    }, [bookId, gNo, isbn, bookFromState]);

    // 🔥 수정: 스크롤 이벤트 핸들러를 별도 useEffect로 분리
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const reviewSection = document.querySelector(`.${bookDetailReview["book-detail-review"]}`);

            if (reviewSection) {
                const reviewSectionTop = reviewSection.offsetTop;
                const scrollProgress = Math.min(scrollY / (reviewSectionTop * 0.5), 1);

                if (scrollY > reviewSectionTop - windowHeight) {
                    setBackgroundFixed(false);
                } else {
                    setBackgroundFixed(true);
                }

                const newOpacity = 0.3 + (scrollProgress * 0.5);
                setGradientOpacity(Math.min(newOpacity, 0.8));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 로딩 상태 처리
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                로딩 중...
            </div>
        );
    }

    // 에러 상태 처리
    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: 'red'
            }}>
                에러 발생: {error}
            </div>
        );
    }

    // 데이터 없음 처리
    if (!bookData) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                책 정보를 찾을 수 없습니다.
            </div>
        );
    }

    console.log("렌더링할 최종 bookData:", bookData);
    console.log("내 리뷰:", myReviews);
    console.log("다른 사용자 리뷰:", othersReviews);
    console.log("전체 하트 수:", totalLikeCount);

    // 🔥 수정: 스타일 객체 정의 수정
    const backgroundLayerStyle = {
        position: backgroundFixed ? 'fixed' : 'absolute'
    };

    const gradientLayerStyle = {
        background: `linear-gradient(180deg,
        rgba(96, 96, 96, 0.00) 0%,
        rgba(250, 241, 241, ${gradientOpacity}) 70%,
        rgba(250, 241, 241, ${Math.min(gradientOpacity + 0.2, 1)}) 90%)`
    };

    return (
        <div>
            <BlurredBackground cover={bookData.cover}>
                <BackButton />
                <section className={styles["book-detail"]}>
                    <BoldText title={bookData.title} className={styles["heading-primary"]} />
                    <ModalContent book={bookData}>
                        <BookDetailRightPanel
                            summary={bookData.summary}
                            rating={bookData.rating}
                            review={bookData.review}
                            info={bookData.info}
                            writer={bookData.writer}
                            reading={bookData.reading}
                            reviewDetail={bookData.reviewDetail}
                        />
                    </ModalContent>
                </section>
            </BlurredBackground>
            <section>
                <BackButton />
                <section className={bookDetailReview["book-detail-review"]}>
                    <div className={bookDetailReview["review-background-layer"]}>
                        <BookCover cover={bookData.cover} className={bookDetailReview["review-book-cover-bg"]} style={backgroundLayerStyle} />
                        <div>
                            <div className={bookDetailReview["review-color-layer"]} />
                            <div className={bookDetailReview["review-gradient-layer"]} style={gradientLayerStyle} />
                            <div className={bookDetailReview["review-blur-background"]} />
                        </div>
                    </div>
                    <div className={bookDetailReview["review-header"]}>
                        <h1 className={bookDetailReview["heading-primary-review"]}>{bookData.title}</h1>
                        <BookCover cover={bookData.cover} className={bookDetailReview["review-book-cover"]} />
                        <div className={bookDetailReview["book-sub-info"]}>
                            <p className={bookDetailReview["author"]}>저자 : {bookData.author}</p>
                            {/* <p className={bookDetailReview["sub-title"]}>{bookData.subtitle}</p> */}
                        </div>
                    </div>
                    <div className={bookDetailReview["review-content"]}>
                        {/* 사용자별로 분리된 리뷰 사용 */}
                        <ReviewSection
                            title="My Review"
                            reviews={myReviews.length > 0 ? myReviews : [{ quote: "", comment: "", writer: "" }]}
                            isScrollable={false}
                            sectionType="my-review"
                        />
                        <ReviewSection
                            title="Review"
                            reviews={othersReviews}
                            isScrollable={true}
                            sectionType="reviews"
                            onLikeClick={handleLikeUpdate} // 🔥 수정: 올바른 핸들러 전달
                            likedReviews={likedReviews}
                        />
                    </div>
                </section>
            </section>
        </div>
    );
};

export default BookDetailPage;