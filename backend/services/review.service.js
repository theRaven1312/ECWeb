import Review from "../models/review.model.js";

const createReview = (userId, newReview) => {
    return new Promise(async (resolve, reject) => {
        const {product, rating, comment} = newReview;
        try {
            const createReview = await Review.create({
                user,
                product,
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

export default {
    createReview,
};
