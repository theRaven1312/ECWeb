import "dotenv/config";
import mongoose from "mongoose";

console.log("Mongo URI:", process.env.DB_URI);

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch((err) => console.error("Lỗi kết nối MongoDB:", err));
