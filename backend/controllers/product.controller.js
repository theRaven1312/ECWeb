import * as productService from '../services/product.service.js';
import Product from '../models/product.model.js';

export const getAll = async (req, res) => 
{
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
        console.log('Request body:', req.body);
        console.log('Files:', req.files);
        
        // The main image URL - use relative paths consistently
        let imageUrl = '';
        if (req.files && req.files.length > 0) {
            imageUrl = `/uploads/${req.files[0].filename}`;
            console.log('Image URL:', imageUrl);
        } else {
            console.log('No files uploaded');
        }
        
        // Additional images URLs - also use relative paths
        const imageUrls = [];
        if (req.files && req.files.length > 1) {
            for (let i = 1; i < req.files.length; i++) {
                imageUrls.push(`/uploads/${req.files[i].filename}`);
            }
            console.log('Additional images:', imageUrls);
        }
        
        // Parse colors from string to array
        const colors = req.body.colors ? req.body.colors.split(',').map(color => color.trim()) : [];
        console.log('Colors:', colors);
        
        // Log category value specifically
        console.log('Category value:', req.body.category);
        
        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            category: req.body.category,
            colors: colors,
            image_url: imageUrl,
            images: imageUrls,
        };
        
        console.log('Product data to save:', productData);
        
        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
        
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            message: 'Creating product failed', 
            error: error.message 
        });
    }
}

export const update = async (req, res) => {
    try {
        console.log('Update request body:', req.body);
        console.log('Update request files:', req.files);

        // Xử lý trường colors (nếu cần)
        if (req.body.colors) {
            req.body.colors = req.body.colors.split(',').map(color => color.trim());
        }

        // Xử lý các checkbox (isFeatured, isSale)
        req.body.isFeatured = req.body.isFeatured === 'true';
        req.body.isSale = req.body.isSale === 'true';

        // Xử lý hình ảnh (nếu có)
        if (req.files && req.files.length > 0) {
            req.body.image_url = `/uploads/${req.files[0].filename}`;
        }

        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(500).json({ message: "Product cannot be updated!" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
};

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


