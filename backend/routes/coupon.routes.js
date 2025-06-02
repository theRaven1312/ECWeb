import express from "express";
const router = express.Router();
import couponController from "../controllers/coupon.controller.js";
import {authCouponMiddleware} from "../middlewares/auth.middleware.js";

router.post("/create-coupon", couponController.createCoupon);
router.put("/update-coupon/:id", couponController.updateCoupon);
router.delete("/delete-coupon/:id", couponController.deleteCoupon);
router.get("/get-coupon/:id", couponController.getCouponById);
router.get("/", couponController.getAllCoupons);
router.post(
    "/apply-coupon",
    authCouponMiddleware,
    couponController.applyCoupon
);
router.post("/use-coupon", authCouponMiddleware, couponController.useCoupon);

export default router;
