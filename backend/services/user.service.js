import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import userToken from "./jwt.service.js";

//Đăng kí tài khoản
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password} = newUser;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        try {
            //Khởi tạo user
            const createUser = await User.create({
                name,
                email,
                password: hashedPassword,
            });
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "Sign Up successfully",
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
                    message: "Account is not existed",
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
                    message: "Wrong Password",
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
                message: "Log In successfully ",
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
                    message: "Account is not existed",
                });
            }

            //Tìm user có id trong route và cập nhật bằng dataUpdate
            const hasUpdateUser = await User.findByIdAndUpdate(
                userId,
                dataUpdate,
                {new: true, runValidators: true}
            );
            resolve({
                status: "OK",
                message: "Update successfully",
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
                    message: "Account is not existed",
                });
            }

            //Tìm user có id trong route và xóa
            await User.findByIdAndDelete(userId);
            resolve({
                status: "OK",
                message: "Delete successfully",
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
                message: "Get all users successfully",
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
                    message: "Account is not existed",
                });
            }
            resolve({
                status: "OK",
                message: "Get user successfully",
                data: user,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const changePassword = (
    currentPassword,
    newPassword,
    confirmPassword,
    userId
) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Tìm user có id trong route và kiểm tra user đó có tồn tại hay không
            const checkUser = await User.findById(userId).select("+password");
            if (checkUser == null) {
                throw new Error("Account does not exist");
            }

            console.log(checkUser.password, currentPassword);
            // So sánh mật khẩu hiện tại
            const isMatch = await bcrypt.compare(
                currentPassword,
                checkUser.password
            );
            if (!isMatch) {
                throw new Error("Current password is not correct");
            }

            if (newPassword !== confirmPassword) {
                throw new Error("New password and confirmation do not match");
            }
            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Cập nhật mật khẩu
            checkUser.password = hashedPassword;
            await checkUser.save();

            resolve({
                status: "OK",
                message: "Change password successfully",
                data: checkUser,
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
    changePassword,
};
