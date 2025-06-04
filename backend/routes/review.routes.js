import express from "express";
const router = express.Router();
import reviewController from "../controllers/review.controller.js";
import {
    authMiddleware,
    authUserMiddleware,
    authChangePassMiddleware,
} from "../middlewares/auth.middleware.js";

router.get("/", reviewController.getAllReviews);
router.post("/:id", reviewController.createReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

export default router;
