import React, { useState } from "react";
import SummaryPanel from "./RightPanel/SummaryPanel";
import InfoPanel from "./RightPanel/InfoPanel";

const BookIcon = ({ fill = "#B7C2C8", ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="28" viewBox="0 0 34 28" fill="none" {...props}>
        <path
            d="M17.1496 1.77241C19.6553 0.520422 22.4259 -0.0850124 25.2166 0.00960844C28.0072 0.104229 30.7319 0.895991 33.15 2.31493C33.379 2.44928 33.5739 2.63605 33.7194 2.8604C33.8649 3.08475 33.9569 3.34049 33.9881 3.60731L34 3.81118V26.2722C34 26.5755 33.9214 26.8734 33.7722 27.1361C33.623 27.3987 33.4084 27.6169 33.15 27.7685C32.8916 27.9201 32.5984 28 32.3 28C32.0016 28 31.7084 27.9201 31.45 27.7685C29.3825 26.5553 27.0373 25.9167 24.65 25.9167C22.2627 25.9167 19.9175 26.5553 17.85 27.7685C17.5916 27.9201 17.2984 28 17 28C16.7016 28 16.4084 27.9201 16.15 27.7685C14.1587 26.5998 11.9084 25.9634 9.60938 25.9187C7.31036 25.874 5.03773 26.4224 3.0039 27.5128L2.448 27.8238L2.2729 27.8998L2.1896 27.9274L2.0026 27.9724L1.8989 27.9896L1.7 28H1.6286L1.4416 27.9793L1.3107 27.9551L1.1271 27.8998L0.9129 27.803L0.7514 27.7063L0.6001 27.5905L0.4981 27.4938L0.374 27.3521L0.2652 27.1983L0.2278 27.1361L0.1734 27.0324L0.0986001 26.8545L0.0714001 26.7698L0.0272001 26.5798L0.0102001 26.4744L0.00340016 26.3897L0 26.2722V3.81118C7.58067e-06 3.5079 0.0785619 3.20997 0.227768 2.94732C0.376973 2.68468 0.591574 2.46657 0.85 2.31493C3.26807 0.895991 5.99281 0.104229 8.78343 0.00960844C11.5741 -0.0850124 14.3447 0.520422 16.8504 1.77241L17 1.84843L17.1496 1.77241Z"
            fill={fill}
        />
    </svg>
);

export const BookDetailRightPanel = ({ summary, rating, review, info, writer, reading, reviewDetail }) => {
    const [panelType, setPanelType] = useState("summary"); // or "info" ( 상태에 따라 다름 )

    // 디버깅을 위한 콘솔 로그 추가
    console.log("BookDetailRightPanel에서 받은 props:");
    console.log("summary:", summary);
    console.log("rating:", rating);
    console.log("review:", review);
    console.log("info:", info);
    console.log("writer:", writer);
    console.log("reading:", reading);
    console.log("reviewDetail:", reviewDetail);

    return (
        <div className="book-detail-right-panel">
            {panelType === "summary" ? (
                <SummaryPanel
                    summary={summary}
                    rating={rating}
                    review={review}
                    onDetailClick={() => setPanelType("info")}
                    BookIcon={BookIcon}
                />
            ) : (
                <InfoPanel
                    info={info}
                    writer={writer}
                    reading={reading}
                    reviewDetail={reviewDetail}
                    rating={rating}
                    onBackClick={() => setPanelType("summary")}
                    BookIcon={BookIcon}
                />
            )}
        </div>
    );
};

