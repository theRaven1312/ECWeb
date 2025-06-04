import Review from "../models/review.model.js";

const getAllReviews = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const reviews = await Review.find()
                .populate("users", "name")
                .populate("products", "name")
                .sort({createdAt: -1});

            resolve({
                status: "OK",
                message: "Get all reviews successfully",
                data: reviews,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const createReview = (userId, newReview) => {
    return new Promise(async (resolve, reject) => {
        const {product, rating, comment} = newReview;
        try {
            const createReview = await Review.create({
                users: userId,
                products: product,
                rating,
                comment,
            });
            if (createReview) {
                resolve({
                    status: "OK",
                    message: "Create review successfully",
                    data: createReview,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteReview = (reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedReview = await Review.findByIdAndDelete(reviewId);
            if (deletedReview) {
                resolve({
                    status: "OK",
                    message: "Delete review successfully",
                    data: deletedReview,
                });
            } else {
                reject(new Error("Review not found"));
            }
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    getAllReviews,
    createReview,
    deleteReview,
};
