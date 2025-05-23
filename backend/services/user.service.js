import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import userToken from "./jwt.service.js";

//Đăng kí tài khoản
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password} = newUser;
        try {
            //Khởi tạo user
            const createUser = await User.create({
                name,
                email,
                password,
            });
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "Đăng kí thành công",
                    data: createUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

//Đăng nhập tài khoản
const logInUser = (userLogIn) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = userLogIn;
        try {
            //KIểm tra email có tồn tại không
            const checkUser = await User.findOne({email}).select("+password");
            if (checkUser == null) {
                resolve({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }

            //Kiểm tra mật khẩu
            const comparePassword = bcrypt.compareSync(
                password,
                checkUser.password
            );
            if (!comparePassword) {
                resolve({
                    status: "ERROR",
                    message: "Mật khẩu sai",
                });
            }
            //Cung cấp access_token khi đăng nhập thành công
            const accessToken = await userToken.generateAccessToken({
                id: checkUser.id,
                role: checkUser.role,
            });

            //Refresh token khi hết hạn
            const refreshToken = await userToken.generateRefreshToken({
                id: checkUser.id,
                role: checkUser.role,
            });

            resolve({
                status: "OK",
                message: "Đăng nhập thành công",
                accessToken,
                refreshToken,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//Chỉnh sửa thông tin tài khoản
const updateUser = (userId, dataUpdate) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Tìm user có id trong route và kiểm tra user đó có tồn tại hay không
            const checkUser = await User.findById(userId);
            if (checkUser == null) {
                resolve({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }

            //Tìm user có id trong route và cập nhật bằng dataUpdate
            const hasUpdateUser = await User.findByIdAndUpdate(
                userId,
                dataUpdate,
                {new: true}
            );
            resolve({
                status: "OK",
                message: "Chỉnh sửa thành công",
                data: hasUpdateUser,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//Xóa User
const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Kiểm tra tài userId đó có tồn tại không
            const checkUser = await User.findById(userId);
            if (checkUser == null) {
                resolve({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }

            //Tìm user có id trong route và xóa
            await User.findByIdAndDelete(userId);
            resolve({
                status: "OK",
                message: "Xóa thành công",
            });
        } catch (e) {
            reject(e);
        }
    });
};

//Get all users
const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find();
            resolve({
                status: "OK",
                message: "Hiện thông tin users thành công",
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//Get users by id
const getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                resolve({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }
            resolve({
                status: "OK",
                message: "Hiện thông tin user thành công",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    createUser,
    logInUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
};
