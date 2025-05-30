import React, {useState, useEffect} from "react";
import RatingStar from "./RatingStar";
import {useSelector} from "react-redux";
import axiosJWT from "../utils/axiosJWT";

// ✅ Helper function to decode JWT and extract user ID
const getUserIdFromToken = (token) => {
    try {
        if (!token) return null;

        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || payload._id || payload.userId;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

const ReviewForm = ({productId, onReviewSubmitted}) => {
    const user = useSelector((state) => state.user);
    const [canReview, setCanReview] = useState(false);
    const [reviewEligibility, setReviewEligibility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");

    // ✅ Get user ID from multiple sources
    const getUserId = () => {
        // Try to get from user state first
        let userId = user?._id || user?.id || user?.userId;

        // If not found, try to extract from token
        if (!userId) {
            const token = localStorage.getItem("access_token");
            userId = getUserIdFromToken(token);
        }

        return userId;
    };

    // ✅ Debug user state
    useEffect(() => {
        console.log("Current user state:", user);
        console.log("User ID from state:", user?._id || user?.id);
        console.log("Access token:", localStorage.getItem("access_token"));

        const tokenUserId = getUserIdFromToken(
            localStorage.getItem("access_token")
        );
        console.log("User ID from token:", tokenUserId);
        console.log("Final User ID:", getUserId());
    }, [user]);

    useEffect(() => {
        const userId = getUserId();

        if (userId && productId) {
            console.log("Checking review eligibility for:", {
                userId,
                productId,
            });
            checkReviewEligibility();
        } else {
            console.log("Missing data:", {userId, productId});
            setLoading(false);
        }
    }, [user, productId]);

    const checkReviewEligibility = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.log("No access token found");
                setCanReview(false);
                setReviewEligibility({
                    canReview: false,
                    reason: "no_token",
                    message: "Please log in again",
                });
                setLoading(false);
                return;
            }
            console.log("Calling API to check review eligibility...");
            const response = await axiosJWT.get(
                `/api/v1/comments/can-review/${productId}`
            );

            console.log("Review eligibility response:", response.data);
            setCanReview(response.data.canReview);
            setReviewEligibility(response.data);
        } catch (error) {
            console.error("Error checking review eligibility:", error);

            if (error.response?.status === 401) {
                setReviewEligibility({
                    canReview: false,
                    reason: "unauthorized",
                    message: "Please log in again",
                });
            } else {
                setReviewEligibility({
                    canReview: false,
                    reason: "error",
                    message:
                        error.response?.data?.message ||
                        "Unable to check review eligibility",
                });
            }
            setCanReview(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || !content.trim()) {
            alert("Please provide both rating and review content");
            return;
        }

        try {
            setSubmitting(true);

            const token = localStorage.getItem("access_token");
            if (!token) {
                alert("Please log in to submit a review");
                return;
            }
            const response = await axiosJWT.post("/api/v1/comments", {
                productId,
                rating,
                content: content.trim(),
            });

            // Reset form
            setRating(0);
            setContent("");

            alert("Review submitted successfully!");

            if (onReviewSubmitted) {
                onReviewSubmitted(response.data.comment);
            }
        } catch (error) {
            console.error("Error submitting review:", error);

            if (error.response?.status === 401) {
                alert("Your session has expired. Please log in again.");
            } else if (
                error.response?.data?.code === "SHIPPED_ORDER_REQUIRED"
            ) {
                alert("You can only review products from your shipped orders.");
            } else {
                alert(
                    error.response?.data?.message || "Failed to submit review"
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // ✅ Updated login check
    const userId = getUserId();
    const token = localStorage.getItem("access_token");
    const isLoggedIn = userId && token;

    console.log("Login check:", {userId, token: !!token, isLoggedIn});

    if (!isLoggedIn) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                    Want to write a review?
                </h3>
                <p className="text-blue-700 mb-4">
                    Please log in to share your experience with this product.
                </p>
                <div className="flex gap-3">
                    <a
                        href="/login"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Log In
                    </a>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Cannot review
    if (!canReview) {
        const getMessageForReason = (reason) => {
            switch (reason) {
                case "no_shipped_order":
                    return {
                        title: "Shipped Order Required",
                        message:
                            "You can only review products from your shipped orders.",
                        icon: "fa-shipping-fast",
                        color: "orange",
                    };
                case "already_reviewed":
                    return {
                        title: "Already Reviewed",
                        message: "You have already reviewed this product.",
                        icon: "fa-check-circle",
                        color: "green",
                    };
                case "unauthorized":
                case "no_token":
                    return {
                        title: "Authentication Required",
                        message:
                            "Your session has expired. Please log in again.",
                        icon: "fa-lock",
                        color: "red",
                    };
                default:
                    return {
                        title: "Cannot Review",
                        message:
                            reviewEligibility?.message ||
                            "Unable to review this product.",
                        icon: "fa-exclamation-circle",
                        color: "red",
                    };
            }
        };

        const messageInfo = getMessageForReason(reviewEligibility?.reason);

        return (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                    <i
                        className={`fa-solid ${messageInfo.icon} text-orange-600`}
                    ></i>
                    <h3 className="font-semibold text-orange-900">
                        {messageInfo.title}
                    </h3>
                </div>
                <p className="text-orange-700 mb-4">{messageInfo.message}</p>

                {(reviewEligibility?.reason === "unauthorized" ||
                    reviewEligibility?.reason === "no_token") && (
                    <div className="flex gap-3">
                        <a
                            href="/login"
                            className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Log In Again
                        </a>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Can review - show form
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-6">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                    </label>
                    <RatingStar
                        rating={rating}
                        readonly={false}
                        onRatingChange={setRating}
                        size="lg"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={1000}
                        rows={5}
                        placeholder="Share your thoughts about this product..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        required
                    />
                    <div className="text-sm text-gray-500 mt-1">
                        {content.length}/1000 characters
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting || !rating || !content.trim()}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                        </span>
                    ) : (
                        "Submit Review"
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
