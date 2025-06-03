// services/category.service.js
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import Review from "../models/review.model.js";

export const getAllProduct = async (filter) => {
    return await Product.find(filter).populate("category");
};

export const getProductById = async (id) => {
    return await Product.findById(id);
};

export const createProduct = async (data) => {
    const product = new Product(data);
    return await product.save();
};

export const updateProduct = async (id, data) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("category", "name description icon");

        return updatedProduct;
    } catch (error) {
        throw new Error("Error updating product: " + error.message);
    }
};

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export const getFeaturedProducts = async () => {
    return await Product.find({isFeatured: true});
};

export const getProductCount = async () => {
    return await Product.countDocuments();
};

export const createReview = async (
    productId,
    userId,
    ratingData,
    commentData
) => {
    try {
        // Kiểm tra sản phẩm có tồn tại
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found"); // Tạo review mới
        const review = await Review.create({
            products: productId,
            users: userId,
            rating: ratingData,
            comment: commentData,
        });

        // Gán review vào product
        product.reviews.push(review._id); // Cập nhật lại số lượng và điểm trung bình
        const allReviews = await Review.find({products: productId});
        product.numReviews = allReviews.length;
        product.rating = Math.floor(
            allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        );

        await product.save();

        return review;
    } catch (error) {
        throw new Error("Error creating review: " + error.message);
    }
};

export const getAllReviews = async (productId) => {
    try {
        const reviews = await Review.find({products: productId})
            .populate("users", "name") // Chỉ lấy tên user
            .sort({createdAt: -1}); // Sắp xếp theo thời gian tạo mới nhất
        return reviews;
    } catch (error) {
        throw new Error("Error fetching reviews: " + error.message);
    }
};

export const adjustProductStock = async (productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found");
        
        product.stock = quantity;
        await product.save();
        return product;
    }
    catch (error) {
        throw new Error("Error adjusting product stock: " + error.message);
    }
}
