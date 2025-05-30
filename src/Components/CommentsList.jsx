import React, { useState, useEffect } from 'react';
import CommentCard from './CommentCard';
import RatingStar from './RatingStar';
import axios from 'axios';

const CommentsList = ({ productId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({});
    const [ratingStats, setRatingStats] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    
    // Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState('');

    useEffect(() => {
        // ✅ Only fetch if productId exists
        if (productId) {
            fetchComments();
        }
    }, [productId, currentPage, sortBy, filterRating]);

    const fetchComments = async () => {
        // ✅ Add safety check
        if (!productId) {
            setError('Product ID is missing');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            const params = new URLSearchParams({
                page: currentPage,
                limit: 6,
                sort: sortBy
            });

            if (filterRating) {
                params.append('rating', filterRating);
            }

            const response = await axios.get(
                `/api/v1/comments/product/${productId}?${params}`
            );

            // ✅ Add safety checks for response data
            setComments(response.data?.comments || []);
            setPagination(response.data?.pagination || {});
            setRatingStats(response.data?.ratingStats || []);
            setAverageRating(response.data?.averageRating || 0);
            setTotalReviews(response.data?.totalReviews || 0);
            setError('');
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load reviews');
            // ✅ Set empty arrays on error
            setComments([]);
            setPagination({});
            setRatingStats([]);
            setAverageRating(0);
            setTotalReviews(0);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Loading state with skeleton
    if (loading) {
        return (
            <div className="commentSection">
                {[...Array(6)].map((_, index) => (
                    <CommentCard key={`loading-${index}`} comment={null} />
                ))}
            </div>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <div className="commentSection">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                    <button 
                        onClick={() => fetchComments()}
                        className="ml-4 text-red-800 underline hover:no-underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Rating Summary */}
            {totalReviews > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {averageRating.toFixed(1)}
                            </div>
                            <RatingStar rating={averageRating} size="lg" />
                            <div className="text-sm text-gray-600 mt-1">
                                Based on {totalReviews} reviews
                            </div>
                        </div>

                        <div className="flex-1">
                            {[5, 4, 3, 2, 1].map(rating => {
                                const stat = ratingStats.find(s => s._id === rating);
                                const count = stat ? stat.count : 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                
                                return (
                                    <div key={rating} className="flex items-center gap-2 mb-1">
                                        <span className="text-sm w-6">{rating}</span>
                                        <i className="fa-solid fa-star text-yellow-400 text-xs"></i>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>

                <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            {/* Comments */}
            <div className="commentSection">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {filterRating ? 
                            `No reviews found for ${filterRating} stars` : 
                            'No reviews yet. Be the first to review this product!'
                        }
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <CommentCard
                            key={comment?._id || `comment-${index}`}
                            comment={comment}
                            onUpdate={fetchComments}
                        />
                    ))
                )}
            </div>

            {/* Load More / Pagination */}
            {pagination.hasNextPage && (
                <div className="text-center mt-6">
                    <button 
                        className="primary-btn learnMoreBtn"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Load More Reviews
                    </button>
                </div>
            )}

            {/* Pagination Info */}
            {pagination.totalPages > 1 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </div>
            )}
        </>
    );
};

export default CommentsList;
