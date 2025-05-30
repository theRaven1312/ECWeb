import React, {useState, useEffect} from "react";
import axiosJWT from "../utils/axiosJWT";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

const ReviewModal = ({isOpen, onClose, onReviewSubmitted}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    const user = useSelector((state) => state.user);

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleStarHover = (starIndex) => {
        setHoverRating(starIndex + 1);
    };
    const handleStarLeave = () => {
        setHoverRating(0);
    };

    const {id} = useParams(); // Assuming product ID is stored in Redux state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosJWT.post(`/api/v1/products/${id}/reviews`, {
                rating,
                comment,
            });

            // Reset form
            setRating(0);
            setComment("");
            setHoverRating(0);

            // Close modal
            onClose();

            // Refresh reviews in parent component
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;
    return (
        <div className="review-modal-overlay" onClick={handleOverlayClick}>
            <div className="review-modal">
                <div className="review-modal__header">
                    <h2 className="review-modal__title">Write a Review</h2>
                    <button className="review-modal__close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="review-modal__form">
                    <div className="review-modal__rating">
                        <label className="review-modal__label">Rating</label>
                        <div className="flex gap-10 items-center">
                            {" "}
                            <div className="review-modal__stars">
                                {[...Array(5)].map((_, index) => {
                                    const isActive =
                                        index < (hoverRating || rating);
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`review-modal__star ${
                                                isActive ? "active" : ""
                                            }`}
                                            onClick={() =>
                                                handleStarClick(index)
                                            }
                                            onMouseEnter={() =>
                                                handleStarHover(index)
                                            }
                                            onMouseLeave={handleStarLeave}
                                        >
                                            ★
                                        </button>
                                    );
                                })}
                            </div>{" "}
                            <p className="review-modal__rating-text">
                                {(hoverRating || rating) > 0
                                    ? `${hoverRating || rating} out of 5 stars`
                                    : "Please select a rating"}
                            </p>
                        </div>
                    </div>

                    <div className="review-modal__comment">
                        <label className="review-modal__label">
                            Your Review
                        </label>
                        <textarea
                            className="review-modal__textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about this product..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="review-modal__actions">
                        <button
                            type="button"
                            className="review-modal__cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="review-modal__submit"
                            disabled={rating === 0 || comment.trim() === ""}
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
