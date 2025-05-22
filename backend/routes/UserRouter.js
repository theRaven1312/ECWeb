import express from "express";
const router = express.Router();
import userController from "../controllers/UserController.js";

router.post("/", userController.createUser);

export default router;
