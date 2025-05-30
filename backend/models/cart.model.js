import express from 'express';
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
            quantity: {type: Number, default: 1, min: 1},
            size: {type: String, default: ''},
            color: {type: String, default: ''},
        },
    ],
    totalPrice: {type: Number, default: 0, min: 0},
    coupon : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons',
        default: null,
    },
});

export default mongoose.model('carts', cartSchema);
