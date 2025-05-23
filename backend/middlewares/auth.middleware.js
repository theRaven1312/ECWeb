import jwt from "jsonwebtoken";
import "dotenv/config";

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
