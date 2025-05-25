import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true, //Xóa khoảng trắng thừa
            maxlength: [50, "Name no more than 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Invalid Email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password minimum 6 characters"],
            select: false, // Không trả về password khi query
        },
        phone: {
            type: String,
            trim: true,
            default: "",
            validate: {
                validator: function (v) {
                    return /^\S+$/.test(v);
                },
                message: "Phone numbers cannot contain spaces",
            },
            validate: {
                validator: function (v) {
                    return /^[0-9]*$/.test(v); // chỉ cho phép số
                },
                message:
                    "Phone number cannot contain letters or special characters",
            },
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        address: {
            type: String,
            default: "",
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("users", UserSchema);
