import User from "../models/user.model.js";
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

export default {createUser};
