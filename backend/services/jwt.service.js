import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = async (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return accessToken;
};

const generateRefreshToken = async (payload) => {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return refreshToken;
};

const refreshToken = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET,
                async (err, user) => {
                    if (err) {
                        resolve({
                            success: false,
                            message: "Refresh token không hợp lệ",
                        });
                    }

                    // Tạo access token mới
                    const accessToken = await generateAccessToken({
                        id: user.id,
                        role: user.role,
                    }); // Access token mới

                    resolve({
                        success: true,
                        message: "Làm mới token thành công",
                        accessToken,
                    });
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};

export default {generateAccessToken, generateRefreshToken, refreshToken};
