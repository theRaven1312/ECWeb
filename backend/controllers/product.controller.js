import * as productService from '../services/product.service.js';

export const getAll = async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            filter = { category: req.query.category.split(',') };
        }
        const products = await productService.getAllProduct(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const create = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: "Cannot create product", error });
    }
}

export const update = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(500).json({ message: "Product cannot be updated!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const remove = async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }
        res.status(200).json({ success: true, message: "Product deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

export const getFeatured = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 4;
        const products = await productService.getFeaturedProducts(count);
        if (!products) {
            return res.status(500).json({ success: false });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCount = async (req, res) => {
    try {
        const productCount = await productService.getProductCount();
        if (!productCount) {
            return res.status(500).json({ success: false });
        }
        res.status(200).json({ count: productCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


