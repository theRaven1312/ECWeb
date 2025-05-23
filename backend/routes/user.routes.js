import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";

router.post("/sign-in", userController.createUser);
router.post("/log-in", userController.logInUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

export default router;
