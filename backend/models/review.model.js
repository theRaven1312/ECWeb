import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    users: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true},
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("reviews", reviewSchema);
