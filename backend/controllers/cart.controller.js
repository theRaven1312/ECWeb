import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";

function calculateTotalPrice(products) {
    let totalPrice = 0;
    products.forEach((item) => {
        const originalPrice = item.product.price;
        const discount = item.product.discount || 0;
        const discountedPrice =
            discount > 0
                ? originalPrice - (originalPrice * discount) / 100
                : originalPrice;
        totalPrice += discountedPrice * item.quantity;
    });
    return totalPrice;
}

//Initialize a new cart for a user
export const initializeCart = async (req, res) => {
    try {
        // ✅ Get user ID from JWT token
        const userId = req.user.id || req.user._id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        const existingCart = await Cart.findOne({user: userId});

        if (existingCart) {
            return res.status(200).json({
                message: "Cart already exists",
                cart: existingCart,
                status: "SUCCESS",
            });
        }

        const newCart = new Cart({user: userId});
        await newCart.save();

        res.status(201).json({
            message: "Cart initialized successfully",
            cart: newCart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Initialize cart error:", error);
        res.status(500).json({
            message: "Error initializing cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// Add a product to the cart
export const addToCart = async (req, res) => {
    try {

        const userId = req.user.id || req.user._id;
        const {productId, quantity = 1, size = "", color = ""} = req.body;

        console.log("Adding to cart:", {
            userId,
            productId,
            quantity,
            size,
            color,
        });

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        // ✅ Validate input
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                status: "ERROR",
            });
        }


        // ✅ Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: "ERROR",
            });
        }

        //Check if the product is available
        if (product.stock <= 0) {
            return res.status(400).json({
                message: "Product is out of stock",
                status: "ERROR",
            });
        }

        if(product.stock < quantity) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock`,
                status: "ERROR",
            });
        }

        let cart = await Cart.findOne({user: userId});

        // ✅ Create cart if doesn't exist
        if (!cart) {
            cart = new Cart({user: userId});
        }

        const existingProductIndex = cart.products.findIndex(
            (p) =>
                p.product.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (existingProductIndex > -1) {
            // Product with same size/color exists, update quantity
            if (cart.products[existingProductIndex].quantity + parseInt(quantity) > product.stock) {
                return res.status(400).json({
                    message: `Only ${product.stock - cart.products[existingProductIndex].quantity} items available in stock`,
                    status: "ERROR",
                });
            }
            // Update quantity of existing product variant
            cart.products[existingProductIndex].quantity += parseInt(quantity);
        } else {
            // Add new product variant to cart
            cart.products.push({
                product: productId,
                quantity: parseInt(quantity),
                size,
                color,
            });
        }

        await cart.populate("products.product");
        cart.totalPrice = calculateTotalPrice(cart.products);

        await cart.save();

        res.status(200).json({
            message: "Product added to cart successfully",
            cart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            message: "Error adding product to cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// ✅ Get the user's cart
export const getUserCart = async (req, res) => {
    try {
        console.log(req.user._id);
        const userId = req.user.id || req.user._id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        let cart = await Cart.findOne({user: userId}).populate(
            "products.product"
        );

        if (!cart) {
            // Create new cart if doesn't exist
            cart = new Cart({user: userId});
            await cart.save();
        }

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            message: "Error retrieving cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// ✅ Update product quantity in cart
export const updateProductQuantity = async (req, res) => {
    try {
        // ✅ Get user ID from JWT token
        const userId = req.user.id || req.user._id;
        const {productId} = req.params;
        const {quantity, size = "", color = ""} = req.body;

        console.log("Updating quantity:", {
            userId,
            productId,
            quantity,
            size,
            color,
        });

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        const cart = await Cart.findOne({user: userId});

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                status: "ERROR",
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.product.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
                status: "ERROR",
            });
        }

        if (quantity <= 0) {
            // Remove product if quantity is 0 or negative
            cart.products.splice(productIndex, 1);
        } else {
            // Update quantity
            cart.products[productIndex].quantity = parseInt(quantity);
        }

        // Populate and recalculate total
        await cart.populate("products.product");
        cart.totalPrice = calculateTotalPrice(cart.products);

        // Check stock availability
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                    status: "ERROR",
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Only ${product.stock} items available in stock for ${product.name}`,
                    status: "ERROR",
                });
            }
        }

        await cart.save();

        res.status(200).json({
            message: "Cart updated successfully",
            cart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Update quantity error:", error);
        res.status(500).json({
            message: "Error updating cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// Remove a product from the cart
export const removeFromCart = async (req, res) => {
    try {
        // ✅ Get user ID from JWT token
        const userId = req.user.id || req.user._id;
        const {productId} = req.params;
        const {size = "", color = ""} = req.body;

        console.log("Removing from cart:", {userId, productId, size, color});

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        const cart = await Cart.findOne({user: userId});

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                status: "ERROR",
            });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.product.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not found in cart",
                status: "ERROR",
            });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Populate and recalculate total
        await cart.populate("products.product");
        cart.totalPrice = calculateTotalPrice(cart.products);

        await cart.save();

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            message: "Error removing product from cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// ✅ Clear entire cart
export const clearCart = async (req, res) => {
    try {
        // ✅ Get user ID from JWT token
        const userId = req.user.id || req.user._id;

        console.log("Clearing cart for user:", userId);

        if (!userId) {
            return res.status(400).json({
                message: "User ID not found in token",
                status: "ERROR",
            });
        }

        const cart = await Cart.findOne({user: userId});

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                status: "ERROR",
            });
        }

        cart.products = [];
        cart.totalPrice = 0;
        cart.coupon = null;

        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart,
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            message: "Error clearing cart",
            error: error.message,
            status: "ERROR",
        });
    }
};

// Apply a coupon to the cart
// export const applyCoupon = async (req, res) => {
//     const userId = req.user.id;

//     const { couponCode } = req.body;

//     try {
//         const cart = await Cart.findOne({ user: userId }).populate('coupon');

//         if (!cart) {
//             return res.status(404).json({
//                 message: 'Cart not found',
//             });
//         }

//         const coupon = await Coupon.findOne({ code: couponCode });
//         if (!coupon) {
//             return res.status(404).json({
//                 message: 'Coupon not found',
//             });
//         }

//         if (coupon.isUsed) {
//             return res.status(400).json({
//                 message: 'Coupon has already been used',
//             });
//         }

//         // Check if the coupon is valid for the user's cart
//         if (coupon.minPurchaseAmount && cart.totalPrice < coupon.minPurchaseAmount) {
//             return res.status(400).json({
//                 message: `Coupon requires a minimum purchase of ${coupon.minPurchaseAmount}`,
//             });
//         }
//         if (coupon.startDate > new Date() || coupon.endDate < new Date()) {
//             return res.status(400).json({
//                 message: 'Coupon is not valid at this time',
//             });
//         }
//         // Apply the coupon to the cart
//         cart.coupon = coupon._id;
//         cart.totalPrice = calculateTotalPrice(cart.products, coupon);
//         await cart.save();
//         res.status(200).json({
//             message: 'Coupon applied successfully',
//             cart,
//         });
//     }
//     catch (error) {
//         res.status(500).json({
//             message: 'Error applying coupon',
//             error: error.message,
//         });
//     }
// }
