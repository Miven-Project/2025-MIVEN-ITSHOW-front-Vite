// BookDetailPage.jsx - 수정된 버전 (사용자별 리뷰 구분)
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useParams, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";
import ModalContent from "../components/BookDetail/ModalContent";
import BoldText from "../components/BoldText";
import BookCover from "../components/BookCover"
import styles from "../styles/BookDetailPage.module.css";
import BlurredBackground from "../components/BookDetail/BlurredBackground";
import { BookDetailRightPanel } from "../components/BookDetail/BookDetailRightPanel";
import bookDetailReview from "../styles/BookDetailReview.module.css"

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

const ReviewCard = ({ quote, comment, writer, className, style, sectionType, likeCount = 0, onLikeClick }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const quoteSectionStyle = {
        height: sectionType === 'my-review' ? '335px' : '500px',
        padding: sectionType === 'my-review' ? '100px' : '50px'
    };

    const handleHeartClick = () => {
        if (sectionType === 'reviews') {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            setCurrentLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

            if (onLikeClick) {
                onLikeClick(newLikedState);
            }
        }
    };

    const quotedHtml = `&quot;${quote || ''}&quot;`;
    return (
        <div className={className} style={style}>
            {quote && quote !== '' ? (
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

const ReviewSection = ({ title, reviews, isScrollable, sectionType }) => {
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
                                onLikeClick={(liked) => {
                                    console.log(`Review ${index} ${liked ? 'liked' : 'unliked'}`);
                                }}
                            />
                        ))}
                    </div>
                )
            ) : (
                <ReviewCard
                    quote={reviews[0]?.quote || ''}
                    comment={reviews[0]?.comment || ''}
                    writer={reviews[0]?.writer || ''}
                    className={bookDetailReview["my-review-box"]}
                    sectionType={sectionType}
                />
            )}
        </div>
    );
};

const stripHtml = (text) => text?.replace(/<[^>]*>/g, '') || '';

// 🔥 새로 추가: 현재 로그인한 사용자 정보 가져오기
const getCurrentUser = () => {
    // localStorage에서 사용자 정보를 가져오는 로직
    // 실제 구현에서는 토큰을 디코딩하거나 별도 API 호출이 필요할 수 있음
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        try {
            return JSON.parse(userInfo);
        } catch (e) {
            console.error("사용자 정보 파싱 실패:", e);
        }
    }

    // 만약 userInfo가 없다면 임시로 토큰에서 추출하거나 다른 방법 사용
    // 지금은 gahyun으로 가정 (실제로는 API 호출이나 토큰 디코딩 필요)
    return { username: "gahyun" }; // 실제 구현에서는 동적으로 가져와야 함
};

// 🔥 수정: 리뷰 데이터를 현재 사용자 기준으로 분리하는 함수
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

const mapToBookData = (data, originalBook = {}) => {
    const title = stripHtml(data.title) || stripHtml(originalBook.title);
    const author = data.author || stripHtml(originalBook.author);
    const isbn = data.isbn || originalBook.isbn;
    const publisher = data.publisher || originalBook.publisher || '';
    const publishDate = data.publicDate || originalBook.pubdate;
    const reviewText = data.reviewText || '';
    const quote = data.quote || '';
    const writer = data.writer || '';
    const likeCount = data.likeCount || 0;
    const comments = Array.isArray(data.comments?.comments) ? data.comments.comments : [];

    return {
        title,
        cover: data.cover || originalBook.image,
        rating: data.rating || 0,
        reviewText,
        quote,
        writer,
        comments,
        author,
        subtitle: isbn || '',
        info: {
            isbn,
            publishDate,
            publisher,
            pages: data.pages || 0,
            period: data.period || ''
        },
        reading: {
            regTime: data.regTime || new Date().toISOString(),
            period: data.period || ''
        },
        summary: {
            quote
        },
        review: {
            like: likeCount,
            reviewCount: comments.length,
            writer,
            reviewMent: reviewText
        },
        reviewDetail: {
            likeCount,
            text: reviewText,
            comment: reviewText
        },
        // 🔥 새로 추가: 모든 리뷰 데이터를 포함
        allReviews: comments.map(comment => ({
            quote: comment.quote || '',
            comment: comment.text || comment.comment || '',
            writer: comment.writer || '',
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

// 🔥 수정: 같은 제목의 모든 리뷰 데이터 가져오기
const fetchAllReviewsForBook = async (bookTitle) => {
    const token = getAuthToken();
    if (!token) return [];

    try {
        const res = await axios.get("http://3.38.185.232:8080/api/gallery/list", {
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
                    const detailRes = await axios.get(`http://3.38.185.232:8080/api/gallery/detail/${book.bookId}`, {
                        headers: { Authorization: token }
                    });

                    if (detailRes.data.code === 200 && detailRes.data.data) {
                        const detailData = detailRes.data.data;
                        allReviews.push({
                            quote: detailData.quote || '',
                            comment: detailData.reviewText || '',
                            writer: detailData.writer || '',
                            likeCount: detailData.likeCount || 0,
                            bookId: book.bookId
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
        const res = await axios.get(`http://3.38.185.232:8080/api/gallery/detail/${gNo}`, {
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
        const res = await axios.get("http://3.38.185.232:8080/api/gallery/list", {
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
        const res = await axios.get("http://3.38.185.232:8080/api/gallery/list", {
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
    // 🔥 새로 추가: 사용자별 리뷰 상태
    const [myReviews, setMyReviews] = useState([]);
    const [othersReviews, setOthersReviews] = useState([]);

    console.log("URL 파라미터 - bookId:", bookId, "gNo:", gNo, "isbn:", isbn);
    console.log("state로 전달받은 book:", bookFromState);

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
                        const mapped = mapToBookData(detailData, bookFromState);
                        console.log("매핑된 최종 데이터:", mapped);

                        // 🔥 새로 추가: 같은 제목의 모든 리뷰 가져오기
                        bookTitle = mapped.title;
                        const allReviews = await fetchAllReviewsForBook(bookTitle);

                        // 🔥 새로 추가: 현재 사용자 기준으로 리뷰 분리
                        const currentUser = getCurrentUser();
                        const { myReviews: userReviews, othersReviews: otherReviews } =
                            separateReviewsByUser(allReviews, currentUser.username);

                        console.log("내 리뷰:", userReviews);
                        console.log("다른 사용자 리뷰:", otherReviews);

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
                        const mapped = mapToBookData({}, bookFromState);
                        setBookData(mapped);

                        // 🔥 새로 추가: 기본 데이터의 경우에도 같은 제목의 리뷰 검색
                        if (bookFromState.title) {
                            const allReviews = await fetchAllReviewsForBook(bookFromState.title);
                            const currentUser = getCurrentUser();
                            const { myReviews: userReviews, othersReviews: otherReviews } =
                                separateReviewsByUser(allReviews, currentUser.username);

                            setMyReviews(userReviews);
                            setOthersReviews(otherReviews);
                        }
                    } else {
                        throw new Error("책 정보를 찾을 수 없습니다.");
                    }
                }
            } catch (err) {
                console.error("책 상세 정보 불러오기 실패:", err);
                setError(err.message || "서버 요청 중 문제가 발생했습니다.");

                // 에러 발생 시에도 기본 데이터가 있으면 표시
                if (bookFromState) {
                    setBookData(mapToBookData({}, bookFromState));
                    setError(null);
                }
            } finally {
                setLoading(false);
            }
        };

        loadBookDetail();
    }, [bookId, gNo, isbn, bookFromState]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const reviewSection = document.querySelector(`.${bookDetailReview["book-detail-review"]}`)

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
                        {/* 🔥 수정: 사용자별로 분리된 리뷰 사용 */}
                        <ReviewSection
                            title="My Review"
                            reviews={myReviews.length > 0 ? myReviews : [{ quote: '', comment: '', writer: '' }]}
                            isScrollable={false}
                            sectionType="my-review"
                        />
                        <ReviewSection
                            title="Review"
                            reviews={othersReviews}
                            isScrollable={true}
                            sectionType="reviews"
                        />
                    </div>
                </section>
            </section>
        </div>
    );
};

export default BookDetailPage;