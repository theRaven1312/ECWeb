import reviewService from "../services/review.service.js";

const createReview = async (req, res) => {
    try {
        const {rating, commment} = req.body;
        const response = await reviewService.createReview(
            req.params.id,
            req.body
        );
        return res.status(200).json(response);
    } catch (err) {
        if (err.message) {
            return res.status(400).json({
                status: "ERROR",
                message: err.message,
            });
        }
    }
};

export default {
    createReview,
};
