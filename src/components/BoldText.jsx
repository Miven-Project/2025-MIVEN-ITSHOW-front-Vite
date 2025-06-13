import React from "react"
import PropTypes from "prop-types";

const BoldText = ({ title, className = "bold-text" }
) => {
    return <h1 className={className}>{title}</h1>;
};

BoldText.propTypes = {
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default BoldText;

{/* <BoldText title="아주 작은 인간들이 말할 때" className="heading-primary" /> */}
{/* <BoldText title="MyReview" className="section-title" /> */ }
{/* <BoldText title="Review" className="section-title" /> */ }