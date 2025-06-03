import * as productService from "../services/product.service.js";
import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {console} from "inspector";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAll = async (req, res) => {
    try {
        let filter = {};
        let sort = {dateCreated: -1}; // Newest first

        // Filter by category
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by featured
        if (req.query.featured === "true") {
            filter.isFeatured = true;
        }

        // Filter by sale
        if (req.query.sale === "true") {
            filter.isSale = true;
        }

        // Handle sorting
        if (req.query.sort) {
            switch (req.query.sort) {
                case "newest":
                    sort = {dateCreated: -1};
                    break;
                case "oldest":
                    sort = {dateCreated: 1};
                    break;
                case "price_low":
                    sort = {price: 1};
                    break;
                case "price_high":
                    sort = {price: -1};
                    break;
                default:
                    sort = {dateCreated: -1};
            }
        }

        console.log("Filter:", filter); // Debug log
        console.log("Sort:", sort); // Debug log

        const products = await Product.find(filter)
            .populate("category", "name description icon")
            .sort(sort);

        console.log("Found products:", products.length); // Debug log

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

export const getById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res
                .status(404)
                .json({success: false, message: "Product not found!"});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const create = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Files:", req.files);

        // The main image URL - use relative paths consistently
        let imageUrl = "";
        if (req.files && req.files.length > 0) {
            imageUrl = `/uploads/${req.files[0].filename}`;
            console.log("Image URL:", imageUrl);
        } else {
            console.log("No files uploaded");
        }

        // Additional images URLs - also use relative paths
        const imageUrls = [];
        if (req.files && req.files.length > 1) {
            for (let i = 1; i < req.files.length; i++) {
                imageUrls.push(`/uploads/${req.files[i].filename}`);
            }
            console.log("Additional images:", imageUrls);
        }

        // Parse colors from string to array
        const colors = req.body.colors
            ? req.body.colors.split(",").map((color) => color.trim())
            : [];
        console.log("Colors:", colors);

        // Parse sizes from string to array
        const sizes = req.body.sizes
            ? req.body.sizes.split(",").map((size) => size.trim())
            : [];
        console.log("Sizes:", sizes); // Log category value specifically
        console.log("Category value:", req.body.category);

        // Handle isSale and discount logic
        const isSale = req.body.isSale === "true" || req.body.isSale === true;
        let discount = parseFloat(req.body.discount) || 0;

        // If isSale is true, set default discount to 20%
        if (isSale && discount === 0) {
            discount = 20;
        }

        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            discount: discount,
            stock: req.body.stock,
            category: req.body.category,
            isSale: isSale,
            colors: req.body.colors
                ? req.body.colors.split(",").map((color) => color.trim())
                : [],
            sizes: sizes, // Thêm sizes vào productData
            image_url: imageUrl,
            images: imageUrls,
        };

        console.log("Product data to save:", productData);

        const product = new Product(productData);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            message: "Creating product failed",
            error: error.message,
        });
    }
};

export const update = async (req, res) => {
    try {
        console.log("Update request body:", req.body);
        console.log("Update request files:", req.files);

        // Handle colors field
        if (req.body.colors) {
            if (typeof req.body.colors === "string") {
                req.body.colors = req.body.colors
                    .split(",")
                    .map((color) => color.trim());
            } else if (Array.isArray(req.body.colors)) {
                req.body.colors = req.body.colors.map((color) => color.trim());
            } else {
                req.body.colors = [];
            }
        }

        // Handle sizes field
        if (req.body.sizes) {
            if (typeof req.body.sizes === "string") {
                req.body.sizes = req.body.sizes
                    .split(",")
                    .map((size) => size.trim());
            } else if (Array.isArray(req.body.sizes)) {
                req.body.sizes = req.body.sizes.map((size) => size.trim());
            } else {
                req.body.sizes = [];
            }
        } // Handle boolean fields
        if (req.body.isFeatured !== undefined) {
            req.body.isFeatured = req.body.isFeatured === "true";
        }
        if (req.body.isSale !== undefined) {
            req.body.isSale = req.body.isSale === "true";
        }

        // Handle discount field with isSale logic
        if (req.body.discount !== undefined) {
            req.body.discount = parseFloat(req.body.discount) || 0;
        }

        // If isSale is being set to true and no discount is specified, set default 20%
        if (
            req.body.isSale === true &&
            (req.body.discount === undefined || req.body.discount === 0)
        ) {
            req.body.discount = 20;
        }

        // Handle image uploads
        if (req.files && req.files.length > 0) {
            console.log("Processing uploaded files:", req.files.length);

            // Update main image
            req.body.image_url = `/uploads/${req.files[0].filename}`;

            // Update additional images if more than one file
            if (req.files.length > 1) {
                req.body.images = [];
                for (let i = 1; i < req.files.length; i++) {
                    req.body.images.push(`/uploads/${req.files[i].filename}`);
                }
            }
        }

        console.log("Processed update data:", req.body);

        const product = await productService.updateProduct(
            req.params.id,
            req.body
        );
        if (!product) {
            return res
                .status(404)
                .json({message: "Product not found or cannot be updated!"});
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({message: error.message});
    }
};

export const remove = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .json({success: false, message: "Product not found!"});
        }

        // Xóa hình ảnh chính
        if (product.image_url) {
            const imagePath = path.join(
                __dirname,
                "../../public",
                product.image_url
            );
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Xóa các hình ảnh bổ sung
        if (product.images && product.images.length > 0) {
            product.images.forEach((image) => {
                const imagePath = path.join(__dirname, "../../public", image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        // Xóa sản phẩm khỏi cơ sở dữ liệu
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({success: false, message: error.message});
    }
};

export const getFeatured = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 4;
        const products = await productService.getFeaturedProducts(count);
        if (!products) {
            return res.status(500).json({success: false});
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getCount = async (req, res) => {
    try {
        const productCount = await productService.getProductCount();
        if (!productCount) {
            return res.status(500).json({success: false});
        }
        res.status(200).json({count: productCount});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const createReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        if (!rating || !comment) {
            return res.status(400).json({
                message: "Rating and comment are required.",
            });
        }

        const review = await productService.createReview(
            req.params.id,
            req.user._id,
            rating,
            comment
        );
        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({message: error.message});
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await productService.getAllReviews(req.params.id);
        if (!reviews || reviews.length === 0) {
            return res
                .status(404)
                .json({message: "No reviews found for this product."});
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({message: error.message});
    }
};

export const adjustStock = async (req, res) => {
    try {
        const {productId, quantity} = req.body;
        
        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Product ID and quantity are required.",
            });
        }

        const product = await productService.adjustProductStock(
            productId,
            quantity
        );
        if (!product) {
            return res
                .status(404)
                .json({message: "Product not found or cannot be updated!"});
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error adjusting stock:", error);
        res.status(500).json({message: error.message});
    }
}
