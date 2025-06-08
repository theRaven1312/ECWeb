import "dotenv/config";
import mongoose from "mongoose";

console.log("Mongo URI:", process.env.LAUNCH_DB);

mongoose
    .connect(process.env.LAUNCH_DB)
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch((err) => console.error("Lỗi kết nối MongoDB:", err));
