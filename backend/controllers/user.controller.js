import jwtService from "../services/jwt.service.js";
import userService from "../services/user.service.js";

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
                .json({status: "ERROR", message: "Email đã tồn tại"});
        }

        return res.status(500).json({status: "ERROR", message: "Lỗi server"});
    }
};

//Đăng nhập tài khoản
const logInUser = async (req, res) => {
    try {
        //Truyền giá trị email, password vào hàm logInUser
        const {email, password} = req.body;
        const respone = await userService.logInUser(req.body);
        const {refreshToken, ...newRespone} = respone;
        console.log(newRespone);
        res.cookie("refresh_token", refreshToken, {
            HttpOnly: true,
            Secure: true,
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
        res.status(500).json({success: false, error: "Lỗi server"});
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
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({success: false, errors: messages});
        }

        // Lỗi khác
        res.status(500).json({success: false, error: "Lỗi server"});
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
        res.status(500).json({success: false, error: "Lỗi server"});
    }
};

//Get All Users
const getAllUsers = async (req, res) => {
    try {
        const respone = await userService.getAllUsers();
        return res.status(200).json(respone);
    } catch (err) {
        res.status(500).json({success: false, error: "Lỗi server"});
    }
};

//Get users by Id
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const respone = await userService.getUserById(userId);
        return res.status(200).json(respone);
    } catch (err) {
        res.status(500).json({success: false, error: "Lỗi server"});
    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        console.log(token);
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
        res.status(500).json({success: false, error: "Lỗi server"});
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
};
