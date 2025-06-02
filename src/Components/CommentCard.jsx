import React from "react";
import start from "../../public/Assets/star.svg";
import verf from "../../public/Assets/verified.svg";
import RatingStar from "./RatingStar";

const CommentCard = ({review}) => {
    if (!review) return null;

    return (
        <div className="commentCard">
            <div className="ratingStar">
                <RatingStar rating={review.rating} />
            </div>{" "}
            <div className="customer">
                <div className="name">{review.users?.name || "Anonymous"}</div>
                <img src={verf} alt="verified" />
            </div>
            <p className="comment">{review.comment}</p>
            <div className="comment-date">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </div>
        </div>
    );
};

export default CommentCard;
