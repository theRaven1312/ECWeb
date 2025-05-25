//Thư viện
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import "./config/mongodb.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

//Router files
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();
const api = process.env.API_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Body parser
app.use(express.json());
// // Dev logging middleware
app.use(morgan("dev"));
// // Security headers
app.use(helmet());
// // Enable CORS
app.use(cors());
//Cookie P
app.use(cookieParser());

// Serve uploaded files

const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

app.use(`${api}/users`, userRouter);

app.use(`${api}/products`, productRouter);

app.use(`${api}/categories`, categoryRouter);

app.use(`${api}/orders`, orderRouter);

// Static
app.get(`/`, (req, res) => {
    res.send("API is running...");
});

app.listen(port, () => {
    console.log(`Server is runiing on http://localhost:${port}`);
});
