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

        // Tính tổng giá trị đơn hàng
        const totalPrices = await Promise.all(
            orderItemsIds .map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
                return orderItem.product.price * orderItem.quantity;
            }
        ));

        console.log(totalPrices);

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        console.log(totalPrice);

        // Tạo đơn hàng
        const order = new Order({
            orderItems: orderItemsIds,
            user: req.body.user,
            totalPrice: totalPrice,
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
            .populate('user', 'name email address')
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message,
        });
    }
});

// Update an order status
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: 'Order updated successfully',
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating order',
            error: error.message,
        });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (deletedOrder) { 
                deletedOrder.orderItems.map(async (orderItemId) => {
                    await OrderItem.findByIdAndDelete(orderItemId).then((result) => {
                        res.status(200).json({
                            message: 'OrderItem deleted successfully',
                            orderItem: result,
                        });
                    }).catch((error) => {
                        res.status(500).json({
                            message: 'Error deleting orderItem',
                            error: error.message,
                        });
                    });
            })
        }

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            message: 'Order deleted successfully',
            order: deletedOrder,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting order',
            error: error.message,
        });
    }
});

// Get total sales
router.get('/get/totalsales', async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
        ]);

        if(!totalSales || totalSales.length === 0) {
            return res.status(404).json({ message: 'No sales found' });
        }
        res.status(200).json({totalSales: totalSales.pop().totalSales});
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching total sales',
            error: error.message,
        });
    }
});

// Get order count
router.get('/get/count', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        res.status(200).json({ orderCount });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching order count',
            error: error.message,
        });
    }
});

//Get user orders
router.get('/get/userorders/:userid', async (req, res) => {
    try {
        const userOrders = await Order.find({ user: req.params.userid })
            .populate('orderItems', 'product quantity')
            .sort({'dateOrdered' : -1}); // Sort by dateOrdered in descending order
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user orders',
            error: error.message,
        });
    }
});


export default router;
