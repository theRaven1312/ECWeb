import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import userToken from "./jwt.service.js";

//Đăng kí tài khoản
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {name, email, password, phone} = newUser;
        try {
            const createUser = await User.create({
                name,
                email,
                password,
                phone,
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
            if (!email || !password) {
                resolve({
                    status: "ERROR",
                    message: "Vui lòng cung cấp email và mật khẩu",
                });
            }

            const checkUser = await User.findOne({email}).select("+password");
            if (checkUser == null) {
                resolve({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }
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
            const accessToken = await userToken.generateAccessToken({
                id: checkUser.id,
                role: checkUser.role,
            });

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

export default {createUser, logInUser};
