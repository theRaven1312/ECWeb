import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                size: {
                    type: String,
                    default: "",
                },
                color: {
                    type: String,
                    default: "",
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        appliedCoupon: {
            code: {
                type: String,
                default: null,
            },
            discountAmount: {
                type: Number,
                default: 0,
            },
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",,
                "delivering",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
