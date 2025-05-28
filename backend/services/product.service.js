// services/category.service.js
import Product from "../models/product.model.js";

export const getAllProduct = async (filter) => {
    return await Product.find(filter).populate('category');
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
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            data, 
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('category', 'name description icon');
        
        return updatedProduct;
    } catch (error) {
        throw new Error('Error updating product: ' + error.message);
    }
};

export const deleteProduct= async (id) => {
    return await Product.findByIdAndDelete(id);
};

export const getFeaturedProducts = async () => {
    return await Product.find({ isFeatured: true });
}

export const getProductCount = async () => {
    return await Product.countDocuments();
}
