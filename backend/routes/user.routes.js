import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import {
    authMiddleware,
    authUserMiddleware,
    authChangePassMiddleware,
} from "../middlewares/auth.middleware.js";

router.get("/", userController.getAllUsers);
router.get("/:id", authUserMiddleware, userController.getUserById);
router.post("/sign-up", userController.createUser);
router.post("/log-in", userController.logInUser);
router.post("/log-out", userController.logOutUser);
router.put("/update-user/:id", userController.updateUser); //từ admin, tên sai
router.delete("/delete-user/:id", userController.deleteUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/change-password/:id", userController.changePassword);

//+ 1 hàm người dùng tự update

export default router;
