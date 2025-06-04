import Prompt from "../Components/Prompt.jsx";
import Navbar from "../Components/Navbar.jsx";
import MainContainer from "../Components/MainContainer.jsx";
import DirectLink from "../Components/DirectLink.jsx";
import ProductImg from "../Components/ProductImg.jsx";
import ProductInfo from "../Components/ProductInfo.jsx";
import CommentSelector from "../Components/CommentSelector.jsx";
import CommentDisplay from "../Components/CommentDisplay.jsx";
import FourItemDisplay from "../Components/FourItemDisplay.jsx";
import Footer from "../Components/Footer.jsx";
import CommentCard from "../Components/CommentCard.jsx";
import ReviewModal from "../Components/ReviewModal.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import axiosJWT from "../utils/axiosJWT.js";

export default function ProductionPage() {
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showPagination, setShowPagination] = useState(false);
    const {id} = useParams();

    const reviewsPerPage = 6;
    useEffect(() => {
        // Only reset reviews immediately, keep product until new data arrives
        setReviews([]);
        setLoading(true);
        setCurrentPage(1);
        setShowPagination(false);

        async function fetchData() {
            try {
                // Fetch product data
                const productRes = await axios.get(`/api/v1/products/${id}`);
                setProduct(productRes.data);

                // Fetch reviews data
                const reviewsRes = await axiosJWT.get(
                    `/api/v1/products/${id}/reviews`
                );
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                // Only reset reviews on error, keep product for better UX
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    // Calculate pagination
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const handleViewAllReviews = () => {
        if (!showPagination) {
            setShowPagination(true);
            // If there are more than 6 reviews, show next page
            if (reviews.length > reviewsPerPage) {
                setCurrentPage(2);
            }
        }
    };

    const refreshReviews = async () => {
        try {
            const reviewsRes = await axiosJWT.get(
                `/api/v1/products/${id}/reviews`
            );
            setReviews(reviewsRes.data);
        } catch (err) {
            console.error("Error refreshing reviews:", err);
        }
    };

    return (
        <>
            <div class="flex flex-col flex-center">
                <div className="w-[80%] h-px bg-gray-300"></div>
            </div>
            <MainContainer>
                <div className="product-container">
                    <div className="product-img">
                        {product && (
                            <ProductImg
                                images={product.images}
                                mainImage={product.image_url}
                            />
                        )}
                    </div>
                    <div className="product-content ">
                        {" "}
                        {product && (
                            <ProductInfo
                                heading={product.name}
                                price={product.price}
                                discount={product.discount || 0}
                                desc={product.description}
                                colors={product.colors}
                                sizes={product.sizes}
                                rating={product.rating}
                                numReviews={product.numReviews}
                                productId={product._id || id}
                                isSold={product.isSold || 0}
                            />
                        )}
                    </div>
                </div>
                {/* Comment-Section */}
                <CommentSelector />
                <div className="comment-header">
                    <div className="flex items-center">
                        <h1 className="comment-heading">All reviews</h1>
                        <span className="comment-quanity">
                            ({reviews.length})
                        </span>
                    </div>
                    <button
                        className="primary-btn comment-header__writeBtn"
                        onClick={() => setShowReviewModal(true)}
                    >
                        Write a review
                    </button>
                </div>
                <div className="commentSection">
                    {loading ? (
                        <div className="text-center py-8">
                            Loading reviews...
                        </div>
                    ) : currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                            <CommentCard key={review._id} review={review} />
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No reviews yet. Be the first to review this product!
                        </div>
                    )}
                </div>
                {/* View All Button or Pagination */}
                {reviews.length > 0 && (
                    <div className="flex flex-col items-center gap-4">
                        {!showPagination && reviews.length > reviewsPerPage ? (
                            <button
                                className="primary-btn learnMoreBtn"
                                onClick={handleViewAllReviews}
                            >
                                View All Reviews ({reviews.length})
                            </button>
                        ) : showPagination && totalPages > 1 ? (
                            <div className="flex items-center gap-4">
                                <button
                                    className={`px-3 py-1 rounded cursor-pointer hover:opacity-80 ${
                                        currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                <div className="flex gap-2">
                                    {Array.from(
                                        {length: Math.min(totalPages, 5)},
                                        (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (
                                                currentPage >=
                                                totalPages - 2
                                            ) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber =
                                                    currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    className={`px-3 py-1 rounded cursor-pointer hover:opacity-80 ${
                                                        currentPage ===
                                                        pageNumber
                                                            ? "bg-black text-white"
                                                            : "bg-gray-200"
                                                    }`}
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            pageNumber
                                                        )
                                                    }
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>

                                <button
                                    className={`px-3 py-1 rounded cursor-pointer hover:opacity-80 ${
                                        currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}
                <FourItemDisplay heading="You might also like" links="top" />
            </MainContainer>{" "}
            {/* Review Modal */}
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                onReviewSubmitted={refreshReviews}
            />
        </>
    );
}
