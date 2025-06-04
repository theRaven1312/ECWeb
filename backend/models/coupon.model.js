import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: [true, "Discount type is required"],
    },
    discountValue: {
        type: Number,
        required: [true, "Discount value is required"],
        min: 0,
    },
    minPurchaseAmount: {type: Number, default: 0, min: 0},
    maxDiscountAmount: {type: Number, default: 0, min: 0},
    startDate: {
        type: Date,
        default: Date.now(),
    },
    endDate: {
        type: Date,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    isActive: {type: Boolean, default: true},
    usageLimit: {type: Number, min: 0},
    usedBy: [{type: mongoose.Schema.Types.ObjectId, ref: "users"}],
});

couponSchema.pre("save", function (next) {
    if (!this.code) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        this.code = result;
    }
    next();
});

export default mongoose.model("coupons", couponSchema);
