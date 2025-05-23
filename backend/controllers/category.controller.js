
import * as CategoryService from "../services/category.service.js";

export const getAll = async (req, res) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getById = async (req, res) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found!" });
    }
    res.status(200).json(category);
};

export const create = async (req, res) => {
    try {
        const category = await CategoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ success: false, message: "Cannot create category", error });
    }
};

export const update = async (req, res) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    if (!category) {
        return res.status(500).json({ message: "Category cannot be updated!" });
    }
    res.status(200).json(category);
};

export const remove = async (req, res) => {
    try {
        const category = await CategoryService.deleteCategory(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found!" });
        }
        res.status(200).json({ success: true, message: "Category deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

