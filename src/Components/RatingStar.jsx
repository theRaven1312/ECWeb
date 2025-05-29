import React from "react";
import star from "../../public/Assets/star.svg";

const RatingStar = ({rating = 0}) => {
    // Tạo array với số lượng sao dựa trên rating
    const stars = Array.from({length: 5}, (_, index) => {
        if (index < Math.floor(rating)) {
            return "full"; // sao đầy
        } else if (index < rating && rating % 1 >= 0.5) {
            return "half"; // sao nửa
        } else {
            return "empty"; // sao rỗng
        }
    });

    return (
        <div className="ratingStar">
            {stars.map((starType, index) => (
                <img
                    key={index}
                    src={star}
                    alt="star"
                    style={{
                        opacity:
                            starType === "full"
                                ? 1
                                : starType === "half"
                                ? 0.6
                                : 0.3,
                        filter:
                            starType === "empty" ? "grayscale(100%)" : "none",
                    }}
                />
            ))}
        </div>
    );
};

export default RatingStar;
