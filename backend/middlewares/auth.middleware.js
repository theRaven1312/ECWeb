import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user.model.js";
//Middleware để xác thực người dùng có quyền truy cập vào các route cần thiết

export const authMiddleware = async (req, res, next) => {
    //Lấy phần header auth
    const authHeader = req.headers.authorization;
    //Lấy token từ authHeader
    const token = authHeader.split(" ")[1];
    //Xác minh token trả về thông tin token (user)
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }

        //Lấy trường role trong payload của user, nếu là admin thì thực hiện hàm tiếp theo
        const {role} = user;
        if (role === "admin") {
            next();
        } else {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }
    });
};

//Với hàm lấy user theo id chỉ được thực hiện bởi admin hoặc người dùng có id đó
export const authUserMiddleware = async (req, res, next) => {
    //Lấy phần header auth
    const authHeader = req.headers.authorization;
    //Lấy userId
    const userId = req.params.id;
    //Lấy token từ authHeader
    const token = authHeader.split(" ")[1];
    //Xác minh token trả về thông tin token (user)
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }

        //Lấy trường role trong payload của user, nếu là admin hoặc là user có id đó
        const {role, id} = user;
        if (role === "admin" || id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }
    });
};

export const authChangePassMiddleware = async (req, res, next) => {
    //Lấy phần header auth
    const authHeader = req.headers.authorization;
    //Lấy userId
    const userId = req.params.id;
    //Lấy token từ authHeader
    const token = authHeader.split(" ")[1];
    //Xác minh token trả về thông tin token (user)
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }

        //Lấy trường role trong payload của user, nếu là admin hoặc là user có id đó
        const {id} = user;
        if (id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: "Không có quyền truy cập",
                status: "ERROR",
            });
        }
    });
};

export const authReviewMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({message: "Not authorized"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        res.status(401).json({message: "Token failed"});
    }
};

export const authCouponMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({message: "Not authorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("User not found for ID:", decoded.id);
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Token verification error:", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({message: "Token expired"});
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid token"});
        }
        res.status(401).json({message: "Token failed"});
    }
};

export const authCartMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({message: "Not authorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("User not found for ID:", decoded.id);
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Token verification error:", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({message: "Token expired"});
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid token"});
        }
        res.status(401).json({message: "Token failed"});
    }
};


//authOrderMiddleware
export const authOrderMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({message: "Not authorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("User not found for ID:", decoded.id);
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Token verification error:", err.message);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({message: "Token expired"});
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({message: "Invalid token"});
        }
        res.status(401).json({message: "Token failed"});
    }
};
