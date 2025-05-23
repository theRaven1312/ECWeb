import mongoose from "mongoose";
import OrderItem from "./order-item.model.js";
import User from "./user.model.js";

const OrderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true
    }],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingAddress: {
        type: String,
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    },
})

OrderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

OrderSchema.set('toJSON', {
    virtuals: true,
});


export default mongoose.model("Order", OrderSchema);
