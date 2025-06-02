//Thư viện
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import "./config/mongodb.js";
import cookieParser from "cookie-parser";
import {fileURLToPath} from "url";

//Router files
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();
const api = process.env.API_URL;
// Body parser
app.use(express.json());
// // Dev logging middleware
app.use(morgan("dev"));
// // Security headers
app.use(helmet());
// // Enable CORS with custom options
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

app.use(cors(corsOptions));

// Configure helmet to allow cross-origin resource loading
app.use(
    helmet({
        crossOriginResourcePolicy: {policy: "cross-origin"},
    })
);

//Cookie P
app.use(cookieParser());

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// And also make it available through the API URL for backward compatibility
app.use(
    `${api}/uploads`,
    express.static(path.join(__dirname, "../public/uploads"))
);

// Add custom middleware for image URLs

app.use(`${api}/users`, userRouter);

app.use(`${api}/products`, productRouter);

app.use(`${api}/categories`, categoryRouter);

app.use(`${api}/orders`, orderRouter);

app.use(`${api}/cart`, cartRoutes);

app.use(`${api}/coupons`, couponRoutes);

app.use(`${api}/reviews`, reviewRoutes);

// Static
app.get(`/`, (req, res) => {
    res.send("API is running...");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is runiing on http://localhost:${port}`);
});
