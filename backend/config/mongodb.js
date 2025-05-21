//LP0pPUs3Rn9nmbtn;

require("dotenv").config({path: "../.env"});

const mongoose = require("mongoose");
console.log("Mongo URI:", process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch((err) => console.error("Lỗi kết nối MongoDB:", err));
