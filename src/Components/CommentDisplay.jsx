import React, {useState, useEffect} from "react";
import CommentCard from "./CommentCard";
import axios from "axios";

const CommentDisplay = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/v1/reviews");

                if (response.data.status === "OK") {
                    // Take only the first 5 reviews for display
                    setReviews(response.data.data.slice(0, 5));
                } else {
                    setError("Failed to load reviews");
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setError("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="commentDisplay">
                <div className="heading">our happy customers</div>
                <div className="commentList">
                    <div className="loading-message">Loading reviews...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="commentDisplay">
                <div className="heading">our happy customers</div>
                <div className="commentList">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="commentDisplay">
            <div className="heading">our happy customers</div>
            <div className="commentList">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <CommentCard key={review._id} review={review} />
                    ))
                ) : (
                    <div className="no-reviews">No reviews available yet</div>
                )}
            </div>
        </div>
    );
};

export default CommentDisplay;
