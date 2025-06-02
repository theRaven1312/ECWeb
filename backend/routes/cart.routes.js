import express from "express";
import * as CartController from "../controllers/cart.controller.js";
import {authCartMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authCartMiddleware);

// Get the user's cart
router.get("/", CartController.getUserCart);

// Initialize a new cart for a user
router.post("/initialize", CartController.initializeCart);

// Add a product to the cart
router.post("/add", CartController.addToCart);

// Update product quantity in the cart
router.put("/update/:productId", CartController.updateProductQuantity);

// Remove a product from the cart
router.delete("/remove/:productId", CartController.removeFromCart);

// Clear entire cart
router.delete("/clear", CartController.clearCart);

export default router;
