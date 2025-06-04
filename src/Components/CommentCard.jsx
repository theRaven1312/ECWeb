import React from "react";
import start from "../../public/Assets/star.svg";
import verf from "../../public/Assets/verified.svg";
import RatingStar from "./RatingStar";
import {useSelector} from "react-redux";
import axiosJWT from "../utils/axiosJWT";

const CommentCard = ({review}) => {
    if (!review) return null;
    const user = useSelector((state) => state.user);

    const handleDeleteReview = async (reviewId) => {
        try {
            window.alert(
                `Are you sure you want to delete "${review.users?.name}" review? This action cannot be undone.`
            );
            const response = await axiosJWT.delete(
                `/api/v1/reviews/${reviewId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                    },
                }
            );
            if (response.data.status === "OK") {
                console.log("Review deleted successfully");
            } else {
                console.error(
                    "Failed to delete review:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            window.location.reload();
            window.scrollTo(0, 0);
        }
    };
    return (
        <div className="commentCard">
            <div className="flex-center-between">
                <div className="ratingStar">
                    <RatingStar rating={review.rating} />
                </div>
                {user?.role === "admin" && (
                    <div
                        className=" cursor-pointer hover:bg-red-100 p-2"
                        onClick={() => {
                            handleDeleteReview(review._id);
                        }}
                    >
                        <i className="fa-solid fa-trash-can text-red-600"></i>
                    </div>
                )}
            </div>
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
