import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import userToken from "./jwt.service.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

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

const forgotPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) throw new Error("Missing Email");
            const user = await User.findOne({email});
            if (!user) throw new Error("User not found");
            const resetToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
            await user.save();

            const html = `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; background: #fff;">
                    <h2 style="color: #2d3748; text-align: center;">Password Reset Request</h2>
                    <p style="color: #4a5568; font-size: 16px;">
                        Hello,<br><br>
                        We received a request to reset your password. Click the button below to set a new password. This link will expire in 10 minutes.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="http://localhost:5173/reset-password/${resetToken}" 
                           style="background: black; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 16px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #718096; font-size: 14px;">
                        If you did not request a password reset, please ignore this email.<br>
                        For security reasons, do not share this link with anyone.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                    <p style="color: #a0aec0; font-size: 12px; text-align: center;">
                        &copy; ${new Date().getFullYear()} ECWeb Team. All rights reserved.
                    </p>
                </div>
            `;
            const data = {email, html};
            const res = await sendEmail(data);
            resolve({
                status: "OK",
                message: "Send email successfully",
                res,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const resetPassword = (token, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            const passwordResetToken = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
            const user = await User.findOne({
                resetPasswordToken: passwordResetToken,
                resetPasswordExpire: {$gt: Date.now()},
            });
            if (!user) {
                return resolve({
                    status: "ERROR",
                    message: "Invalid or Expired Token",
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            resolve({
                status: "OK",
                message: "Reset Password successfully",
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
    forgotPassword,
    resetPassword,
};
