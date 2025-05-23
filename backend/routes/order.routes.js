import express from 'express';
import Order from '../models/order.model.js';
import OrderItem from '../models/order-item.model.js';
import { populate } from 'dotenv';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    try {
        // Tạo các OrderItem trước
        const orderItemsIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                const newOrderItem = new OrderItem({
                    product: orderItem.product,
                    quantity: orderItem.quantity,
                });
                const savedItem = await newOrderItem.save();
                return savedItem._id;
            })
        );

        // Tạo đơn hàng
        const order = new Order({
            orderItems: orderItemsIds,
            user: req.body.user,
            totalPrice: req.body.totalPrice,
            shippingAddress: req.body.shippingAddress,
        });

        const createdOrder = await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: createdOrder,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message,
        });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('orderItems', 'product quantity')
            .populate('user', 'name email')
            .sort({'dateOrdered' : -1}); // Sort by dateOrdered in descending order
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message,
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const orders = await Order.findById(req.params.id)
            .populate(
                {path: 'orderItems', populate: 
                    {path: 'product', populate: 'category'}}) // Populate product details in orderItems
            .populate('user', 'name email')
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message,
        });
    }
});



export default router;
