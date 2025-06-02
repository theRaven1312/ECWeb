import jwtService from "../services/jwt.service.js";
import couponService from "../services/coupon.service.js";

// Create a new coupon
const createCoupon = async (req, res) => {
    try {
        const response = await couponService.createCoupon(req.body);
        return res.status(200).json({
            status: "OK",
            message: "Coupon created successfully",
            data: response,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messagesError = Object.values(err.errors).map(
                (val) => val.message
            );
            return res
                .status(400)
                .json({status: "ERROR", messages: messagesError});
        }
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const updateCoupon = async (req, res) => {
    try {
        const response = await couponService.updateCoupon(
            req.params.id,
            req.body
        );
        return res.status(200).json({
            status: "OK",
            message: "Coupon updated successfully",
            data: response,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messagesError = Object.values(err.errors).map(
                (val) => val.message
            );
            return res
                .status(400)
                .json({status: "ERROR", messages: messagesError});
        }
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const response = await couponService.deleteCoupon(req.params.id);
        return res.status(200).json({
            status: "OK",
            message: "Coupon deleted successfully",
            data: response,
        });
    } catch (err) {
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const getCouponById = async (req, res) => {
    try {
        const response = await couponService.getCouponById(req.params.id);
        return res.status(200).json({
            status: "OK",
            message: "Coupon retrieved successfully",
            data: response,
        });
    } catch (err) {
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const response = await couponService.getAllCoupons();
        return res.status(200).json({
            status: "OK",
            message: "Coupons retrieved successfully",
            data: response,
        });
    } catch (err) {
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

export default {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCoupon,
};
