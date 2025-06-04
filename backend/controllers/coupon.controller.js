import jwtService from "../services/jwt.service.js";
import couponService from "../services/coupon.service.js";
import Cart from "../models/cart.model.js";
import Coupon from "../models/coupon.model.js";

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

const applyCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const cart = await Cart.findOne({user: req.user._id}).populate(
            "products.product"
        );

        if (!cart) return res.status(404).json({message: "Cart not found"});

        const cartTotal = cart.products.reduce((total, item) => {
            const productPrice = item.product.price || 0;
            return total + productPrice * item.quantity;
        }, 0);

        const response = await couponService.applyCoupon(
            req.user._id,
            code,
            cartTotal
        );

        cart.totalPrice = response.finalTotal;
        await cart.save();

        // const couponUpdate = await Coupon.findOne({
        //     code: response.appliedCoupon,
        // });
        // couponUpdate.isActive = false;
        // await couponUpdate.save();

        return res.status(200).json({
            status: "OK",
            message: "Coupon applied successfully",
            data: response,
        });
    } catch (err) {
        if (err) {
            return res.status(400).json({
                status: "ERROR",
                message: err.message,
            });
        }
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const useCoupon = async (req, res) => {
    try {
        const {code} = req.body;

        if (!code) {
            return res.status(400).json({
                status: "ERROR",
                message: "Coupon code is required",
            });
        }

        const response = await couponService.useCoupon(code);

        return res.status(200).json({
            status: "OK",
            message: "Coupon used successfully",
            data: response,
        });
    } catch (err) {
        return res.status(400).json({
            status: "ERROR",
            message: err.message,
        });
    }
};

export default {
    createCoupon,
    updateCoupon,
    getCouponById,
    getAllCoupons,
    deleteCoupon,
    applyCoupon,
    useCoupon,
};
