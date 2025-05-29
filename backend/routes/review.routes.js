import express from "express";
const router = express.Router();
import reviewController from "../controllers/review.controller.js";
import {
    authMiddleware,
    authUserMiddleware,
    authChangePassMiddleware,
} from "../middlewares/auth.middleware.js";

router.post("/:id", reviewController.createReview);

export default router;
