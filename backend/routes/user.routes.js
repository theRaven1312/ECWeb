import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import {
    authMiddleware,
    authUserMiddleware,
} from "../middlewares/auth.middleware.js";

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authUserMiddleware, userController.getUserById);
router.post("/sign-in", userController.createUser);
router.post("/log-in", userController.logInUser);
router.post("/log-out", userController.logOutUser);
router.put("/update-user/:id", userController.updateUser); //từ admin, tên sai
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.post("/refresh-token", userController.refreshToken);

//+ 1 hàm người dùng tự update

export default router;
