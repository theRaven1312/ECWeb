
//Thư viện
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import "./config/mongodb.js";

//Router files
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();
const api = process.env.API_URL;

// Body parser
app.use(express.json());

// // Dev logging middleware
app.use(morgan("dev"));
// // Security headers
app.use(helmet());
// // Enable CORS
app.use(cors());

const port = process.env.PORT || 3000;

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
