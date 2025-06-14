// App.jsx
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import BackButton from "../components/BackButton";
import ModalContent from "../components/BookDetail/ModalContent";
import BoldText from "../components/BoldText";
import BookCover from "../components/BookCover"
import styles from "../styles/BookDetailPage.module.css";
import BlurredBackground from "../components/BookDetail/BlurredBackground";
import { BookDetailRightPanel } from "../components/BookDetail/BookDetailRightPanel";
import bookDetailReview from "../styles/BookDetailReview.module.css"
// import { ReactComponent as FillHeartIcon } from '../assets/images/fillHeartIcon.svg';
// import BlurredBackground from "../components/BookDetail/BlurredBackground";

const HeartIcon = ({ filled, onClick }) => {

    // const handleClick = () => {
    //     setIsFilled(!isFilled);
    // };

    return (
        // <div onClick={onClick} style={{ cursor: 'pointer' }}>
        //     {isFilled ? (
        //         <FillHeartIcon width="26" height="25" />
        //     ) : (
        //         <svg width="26" height="25" viewBox="0 0 25 25">
        //             <path
        //                 d="M10.605 16.9482L10.5 17.0572L10.3845 16.9482C5.397 12.2507 2.1 9.14441 2.1 5.99455C2.1 3.81471 3.675 2.17984 5.775 2.17984C7.392 2.17984 8.967 3.26975 9.5235 4.75204H11.4765C12.033 3.26975 13.608 2.17984 15.225 2.17984C17.325 2.17984 18.9 3.81471 18.9 5.99455C18.9 9.14441 15.603 12.2507 10.605 16.9482ZM15.225 0C13.398 0 11.6445 0.882834 10.5 2.26703C9.3555 0.882834 7.602 0 5.775 0C2.541 0 0 2.6267 0 5.99455C0 10.1035 3.57 13.4714 8.9775 18.5613L10.5 20L12.0225 18.5613C17.43 13.4714 21 10.1035 21 5.99455C21 2.6267 18.459 0 15.225 0Z"
        //                 fill="white"
        //                 stroke="white"
        //                 strokeWidth="1"
        //             />
        //         </svg>
        //     )}
        // </div>
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

    // const getQuoteSectionHeight = () => {
    //     switch (sectionType) {
    //         case 'reviews':
    //             return '500px'; // 다른 사람들 리뷰 높이 (원하는 값으로 변경)
    //         case 'my-review':
    //             return '335px'; // 내 리뷰 높이 (기본값)
    //         default:
    //             return '335px';
    //     }
    // };

    const quoteSectionStyle = {
        height: sectionType === 'my-review' ? '335px' : '500px',
        padding: sectionType === 'my-review' ? '100px' : '50px'
    };

    // const quoteSectionStyle = { height: getQuoteSectionHeight() };
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

    return (
        <div className={className} style={style}>
            {quote && (
                <div className={bookDetailReview["quote-section"]} style={quoteSectionStyle}>
                    <p className={bookDetailReview["quote-text"]}>"{quote}"</p>
                </div>
            )}

            {comment && writer && (
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
                                console.log(`Review ${index} ${liked ? 'liked' : 'unliked'}`)
                            }}
                        />
                    ))}
                </div>
            ) : (
                <ReviewCard
                    quote={reviews[0]?.quote}
                    comment={reviews[0]?.comment}
                    writer={reviews[0]?.writer}
                    className={bookDetailReview["my-review-box"]}
                    sectionType={sectionType}
                />
            )}
        </div>
    );
};

const BookDetailPage = () => {
    const [bookData, setBookData] = useState(null);
    const [backgroundFixed, setBackgroundFixed] = useState(true);
    const [gradientOpacity, setGradientOpacity] = useState(0.3); // 초기 투명도 낮게

    useEffect(() => {
        fetch("/data/bookdetailmodal.json")
            .then(res => {
                if (!res.ok) throw new Error("네트워크 응답 오류");
                return res.json();
            })
            .then(data => setBookData(data))
            .catch(err => console.error("JSON fetch 실패:", err));
    }, []);

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

    if (!bookData) return <div>로딩 중...</div>;

    const myReviews = [
        {
            quote: bookData.summary.quote,
            comment: bookData.reviewDetail.comment,
            writer: bookData.writer,
            likeCount: 0
        }
    ];

    // 다른 사람들 리뷰 (임시 데이터 - 실제로는 API에서 가져와야 함)
    const othersReviews = [
        {
            quote: "우리 집에는 곰팡이조차 사랑스럽다는 듯이 오래 공들여 바라보는 아이들이 넷이나 있다. 아이들이 곧잘 그림을 그려냈고 그 그림들은 내게 위로를 건네주었다. 세상을 살아가는 올바른 방식을 상상할 수 있도록 해주었다. 이 책은 그런 아이들의 그림에 빚지고 있다. 아주 작은 인간들이 말하는 연민과 사랑같은 것.",
            comment: "이 책을 읽으면서 일상의 소중함을 다시 느꼈습니다.",
            writer: "독서가A",
            likeCount: 12
        },
        {
            quote: "우리 집에는 곰팡이조차 사랑스럽다는 듯이 오래 공들여 바라보는 아이들이 넷이나 있다. 아이들이 곧잘 그림을 그려냈고 그 그림들은 내게 위로를 건네주었다. 세상을 살아가는 올바른 방식을 상상할 수 있도록 해주었다. 이 책은 그런 아이들의 그림에 빚지고 있다. 아주 작은 인간들이 말하는 연민과 사랑같은 것.",
            comment: "아이들의 순수한 시선이 감동적이었습니다.",
            writer: "독서가B",
            likeCount: 12
        },
        {
            quote: "우리 집에는 곰팡이조차 사랑스럽다는 듯이 오래 공들여 바라보는 아이들이 넷이나 있다. 아이들이 곧잘 그림을 그려냈고 그 그림들은 내게 위로를 건네주었다. 세상을 살아가는 올바른 방식을 상상할 수 있도록 해주었다. 이 책은 그런 아이들의 그림에 빚지고 있다. 아주 작은 인간들이 말하는 연민과 사랑같은 것.",
            comment: "깊이 있는 사유를 담고 있어요.",
            writer: "독서가C",
            likeCount: 12
        },
        {
            quote: "우리 집에는 곰팡이조차 사랑스럽다는 듯이 오래 공들여 바라보는 아이들이 넷이나 있다. 아이들이 곧잘 그림을 그려냈고 그 그림들은 내게 위로를 건네주었다. 세상을 살아가는 올바른 방식을 상상할 수 있도록 해주었다. 이 책은 그런 아이들의 그림에 빚지고 있다. 아주 작은 인간들이 말하는 연민과 사랑같은 것.",
            comment: "아이들의 순수한 시선이 감동적이었습니다.",
            writer: "독서가D",
            likeCount: 12
        },
        {
            quote: "우리 집에는 곰팡이조차 사랑스럽다는 듯이 오래 공들여 바라보는 아이들이 넷이나 있다. 아이들이 곧잘 그림을 그려냈고 그 그림들은 내게 위로를 건네주었다. 세상을 살아가는 올바른 방식을 상상할 수 있도록 해주었다. 이 책은 그런 아이들의 그림에 빚지고 있다. 아주 작은 인간들이 말하는 연민과 사랑같은 것.",
            comment: "깊이 있는 사유를 담고 있어요.",
            writer: "독서가E",
            likeCount: 12
        },
    ];

    const backgroundLayerStyle = {
        position: backgroundFixed ? 'fixed' : 'absolute'
    };

    const gradientLayerStyle = {
        background: `linear-gradient(180deg,
            rgba(96, 96, 96, 0.00) 0%,
            rgba(250, 241, 241, ${gradientOpacity}) 70%,
            rgba(250, 241, 241, ${Math.min(gradientOpacity + 0.2, 1)}) 90%)`
    }
    return (
        <div>
            <BlurredBackground cover={bookData.cover}>
                <BackButton />
                <section className={styles["book-detail"]}>
                    <BoldText title={bookData.title} className={styles["heading-primary"]} />
                    <ModalContent book={bookData} >
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
            <section className={styles["book-detail-review"]}>
                <BackButton />
                {/* </BlurredBackground> */}
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
                            <p className={bookDetailReview["author"]}>{bookData.author}</p>
                            <p className={bookDetailReview["sub-title"]}>{bookData.subtitle}</p>
                        </div>
                    </div>
                    <div className={bookDetailReview["review-content"]}>
                        <ReviewSection
                            title="My Review"
                            reviews={myReviews}
                            isScrollable={false}
                            sectionType="my-review" />
                        <ReviewSection
                            title="Review"
                            reviews={othersReviews}
                            isScrollable={true}
                            sectionType="reviews" />
                    </div>
                </section >
            </section >
        </div >
    );
};

export default BookDetailPage;
