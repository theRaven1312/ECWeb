import express from "express";
const router = express.Router();
import couponController from "../controllers/coupon.controller.js";

router.post("/create-coupon", couponController.createCoupon);
router.put("/update-coupon/:id", couponController.updateCoupon);
router.delete("/delete-coupon/:id", couponController.deleteCoupon);
router.get("/get-coupon/:id", couponController.getCouponById);
router.get("/", couponController.getAllCoupons);

export default router;
