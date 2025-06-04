import jwtService from "../services/jwt.service.js";
import userService from "../services/user.service.js";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

//Đăng kí tài khoản
const createUser = async (req, res) => {
    try {
        //Khởi tạo tài khoản bằng các trường name, email, pass
        const {name, email, password} = req.body;
        const respone = await userService.createUser(req.body);

        return res.status(200).json(respone);
    } catch (err) {
        //Xuất các kết quả lỗi theo thư viện moogose

        if (err.name === "ValidationError") {
            const messagesError = Object.values(err.errors).map(
                (val) => val.message
            );
            return res
                .status(400)
                .json({status: "ERROR", messages: messagesError});
        }

        if (err.code === 11000) {
            return res
                .status(400)
                .json({status: "ERROR", message: "Email has existed"});
        }

        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

//Đăng nhập tài khoản
const logInUser = async (req, res) => {
    try {
        //Truyền giá trị email, password vào hàm logInUser
        const {email, password} = req.body;
        const respone = await userService.logInUser(req.body);
        const {refreshToken, ...newRespone} = respone;
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            samesite: "strict",
        });
        return res.status(200).json(newRespone);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({success: false, errors: messages});
        }

        // Lỗi khác
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

//Chỉnh sửa thông tin tài khoản
const updateUser = async (req, res) => {
    try {
        //Truyền vào hàm updateUser giá trị id và data cần được update
        const userId = req.params.id;
        const dataUpdate = req.body;
        const respone = await userService.updateUser(userId, dataUpdate);
        return res.status(200).json(respone);
    } catch (err) {
        console.error("ERROR:", err);

        if (err.name === "ValidationError") {
            const messagesError = Object.values(err.errors).map(
                (val) => val.message
            );
            return res
                .status(400)
                .json({status: "ERROR", messages: messagesError});
        }

        if (err.code === 11000) {
            return res
                .status(400)
                .json({status: "ERROR", message: "Email has existed"});
        }

        // Lỗi khác
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

const logOutUser = async (req, res) => {
    try {
        res.clearCookie("refresh_token");
        return res.status(200).json({
            status: "OK",
            message: "Logout sucessfully",
        });
    } catch (err) {
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

//Xóa user
const deleteUser = async (req, res) => {
    try {
        //Truyền vào hàm deleteUser giá trị id
        const userId = req.params.id;
        const respone = await userService.deleteUser(userId);
        return res.status(200).json(respone);
    } catch (err) {
        console.error("ERROR:", err);

        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({success: false, errors: messages});
        }

        // Lỗi khác
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

//Get All Users
const getAllUsers = async (req, res) => {
    try {
        const respone = await userService.getAllUsers();
        return res.status(200).json(respone);
    } catch (err) {
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

//Get users by Id
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const respone = await userService.getUserById(userId);
        return res.status(200).json(respone);
    } catch (err) {
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) {
            return res.status(404).json({
                success: false,
                error: "Token is invalid",
            });
        }
        const respone = await jwtService.refreshToken(token);
        return res.status(200).json(respone);
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, error: "SERVER ERROR"});
    }
};

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword, confirmPassword} = req.body;
        const userId = req.params.id;
        const respone = await userService.changePassword(
            currentPassword,
            newPassword,
            confirmPassword,
            userId
        );
        return res.status(200).json(respone);
    } catch (err) {
        if (err.message) {
            return res.status(400).json({
                status: "ERROR",
                message: err.message,
            });
        }

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

const forgotPassword = async (req, res) => {
    try {
        console.log(req.body);
        const {email} = req.body;
        const respone = await userService.forgotPassword(email);
        return res.status(200).json(respone);
    } catch (err) {
        if (err.message) {
            return res.status(400).json({
                status: "ERROR",
                message: err.message,
            });
        }

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

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const newPassword = req.body.password;
        console.log(newPassword);
        const respone = await userService.resetPassword(token, newPassword);
        return res.status(200).json(respone);
    } catch (err) {
        if (err.message) {
            return res.status(400).json({
                status: "ERROR",
                message: err.message,
            });
        }

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

const sendCoupon = async (req, res) => {
    try {
        const {email, couponCode} = req.body;
        const response = await userService.sendCoupon(email, couponCode);
        return res.status(200).json({
            status: "OK",
            message: "Coupon sent successfully",
            data: response,
            user: response.user, // Include updated user data
        });
    } catch (err) {
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

const sendAllCoupons = async (req, res) => {
    try {
        const {couponCode} = req.body;
        const coupon = await Coupon.findOne({code: couponCode});
        console.log(coupon);
        if (!coupon) {
            return res.status(404).json({
                status: "ERROR",
                message: "Coupon not found",
            });
        }
        if (!coupon.isActive) {
            return res.status(400).json({
                status: "ERROR",
                message: "Coupon is not active",
            });
        }
        if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
            return res.status(400).json({
                status: "ERROR",
                message: "Coupon has expired",
            });
        }
        if (coupon.usageLimit && coupon.usageLimit <= 0) {
            return res.status(400).json({
                status: "ERROR",
                message: "Coupon usage limit reached",
            });
        }
        const response = await userService.sendAllCoupons(couponCode);
        console.log(response);
        return res.status(200).json({
            status: "OK",
            message: "All coupons sent successfully",
            data: response,
        });
    } catch (err) {
        return res.status(500).json({status: "ERROR", message: "SERVER ERROR"});
    }
};

export default {
    createUser,
    logInUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    refreshToken,
    logOutUser,
    sendCoupon,
    sendAllCoupons,
    changePassword,
    forgotPassword,
    resetPassword,
};
