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
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({success: false, errors: messages});
        }

        if (err.code === 11000) {
            return res
                .status(400)
                .json({success: false, message: "Email đã tồn tại"});
        }

        return res.status(500).json({success: false, message: "Lỗi server"});

        // Lỗi khác
        res.status(500).json({success: false, error: "Lỗi server"});
    }
};

//Đăng nhập tài khoản
const logInUser = async (req, res) => {
    try {
        //Truyền giá trị email, password vào hàm logInUser
        const {email, password} = req.body;
        const respone = await userService.logInUser(req.body);
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

const deleteUser = async (req, res) => {
    try {
        //Truyền vào hàm deleteUser giá trị id
        const userId = req.params.id;
        console.log(userId);
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
export default {createUser, logInUser, updateUser, deleteUser};
