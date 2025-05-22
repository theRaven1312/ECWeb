//Thư viện
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";

//Router files
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// Security headers
app.use(helmet());
// Enable CORS
app.use(cors());

//Connect MongoDB
import "./config/mongodb.js";

const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
