import express from "express";
import * as OrderController from "../controllers/order.controller.js";
import {authOrderMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authOrderMiddleware);

// Create new order
router.post("/", OrderController.createOrder);

// Get user's orders
router.get("/", OrderController.getAllOrders);

router.get("/user", OrderController.getUserOrders);

// Get specific order
router.get("/:orderId", OrderController.getOrderById);

router.put("/:orderId/status", OrderController.updateOrderStatus);

// Delete order
router.delete("/:orderId", OrderController.deleteOrder);

export default router;
