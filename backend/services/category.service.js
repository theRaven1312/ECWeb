// services/category.service.js
import Category from "../models/category.model.js";

export const getAllCategories = async () => {
    return await Category.find();
};

export const getCategoryById = async (id) => {
    return await Category.findById(id);
};

export const createCategory = async (data) => {
    const category = new Category(data);
    return await category.save();
};

export const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};
