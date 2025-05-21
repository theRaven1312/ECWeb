//Thư viện
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

require("dotenv").config({path: "../.env"});

//Router files
const userRouter = require("./routes/UserRouter");

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
require("./config/mongodb");
const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
