import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    // price: {
    //     type: Number,
    //     required: true,
    // },
}, {
    timestamps: true,
})

export default mongoose.model("OrderItem", OrderItemSchema);
