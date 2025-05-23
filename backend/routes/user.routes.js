import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.post("/sign-in", userController.createUser);
router.post("/log-in", userController.logInUser);
router.put("/update-user/:id", userController.updateUser); //từ admin, tên sai
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);

//+ 1 hàm người dùng tự update

export default router;
