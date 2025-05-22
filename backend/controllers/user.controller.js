import userService from "../services/user.service.js";
const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const {name, email, password, phone} = req.body;
        const respone = await userService.createUser(req.body);
        return res.status(200).json(respone);
    } catch (err) {
        console.error("ERROR:", err);

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

export default {createUser};
