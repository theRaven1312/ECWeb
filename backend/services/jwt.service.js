import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessToken = async (payload) => {
    console.log(payload);
    const accessToken = jwt.sign(
        {
            payload,
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
    return accessToken;
};

const generateRefreshToken = async (payload) => {
    console.log(payload);
    const refreshToken = jwt.sign(
        {
            payload,
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN}
    );
    return refreshToken;
};

export default {generateAccessToken, generateRefreshToken};
