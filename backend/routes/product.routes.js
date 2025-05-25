import express from 'express';
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';
const router = express.Router();
import * as ProductController from '../controllers/product.controller.js';
import upload from '../middlewares/upload.middleware.js';

router.get('/', ProductController.getAll);

router.post('/', upload.array('images', 10), ProductController.create);

router.put('/:id', upload.array('images', 10), ProductController.update);

router.delete('/:id', ProductController.remove);
router.get('/get/count', ProductController.getCount);
router.get('/get/featured/:count', ProductController.getFeatured);

router.get('/search', async (req, res) => {
    const query = req.query.q;
    
    try {
        const products = await Product.find({
            name: { $regex: query, $options: 'i' } // tìm không phân biệt hoa thường
        })
        
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Search failed', error: err.message });
    }
});



router.get('/:id', ProductController.getById);

export default router;


// // Create a new product
// router.post(`/`, async (req, res) => {
//     const category = await Category.findById(req.body.category);
//     if (!category) return res.status(400).send("Invalid category!");

//     let product = new Product({
//         name: req.body.name,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image_url: req.body.image_url,
//         brand: req.body.brand,
//         price : req.body.price,
//         stock : req.body.stock,
//         category : req.body.category,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured,
//     });

//     product = await product.save();
//     if (!product) return res.status(500).send("The product cannot be created!");
//     res.status(200).send(product);
// })

// // Get all products
// router.get(`/`, async (req, res) => {

//     let filter = {};
//     if(req.query.category) { filter = {category: req.query.category.split(',') } };

//     const productList = await Product.find(filter).populate('category');

//     if(!productList) {
//         res.status(500).json({success:false});
//     }
//     res.send(productList);
// })

// // Get product by ID
// router.get(`/:id`, async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send("Invalid product ID");
//     }

//     const productList = await Product.findById(req.params.id).populate('category');

//     if(!productList) {
//         res.status(500).json({success:false});
//     }
//     res.send(productList);
// })

// // Update product by ID
// router.put(`/:id`, async (req, res) => {

//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send("Invalid product ID");
//     }

//     const category = await Category.findById(req.body.category);

//     if (!category) return res.status(400).send("Invalid category!");

//     const product = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image_url: req.body.image_url,
//             brand: req.body.brand,
//             price : req.body.price,
//             stock : req.body.stock,
//             category : req.body.category,
//             rating: req.body.rating,
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured,
//         },
//         { new: true }
//     );

//     if (!product) return res.status(500).send("The category cannot be updated!");
//     res.status(200).send(product);
// })

// // Delete product by ID
// router.delete(`/:id`, async (req, res) => {
//     Product.findByIdAndDelete(req.params.id).then((product) => {
//         if (product) {
//             return res.status(200).json({ success: true, message: "The product is deleted!" });
//         } else {
//             return res.status(404).json({ success: false, message: "product not found!" });
//         }
//     }).catch((err) => {
//         return res.status(500).json({ success: false, error: err });
//     });
// });

// // Get count of products
// router.get('/get/count', async (req, res) => {
//     const productCount = await Product.countDocuments();

//     if (!productCount) {
//         res.status(500).json({ success: false });
//     }
//     res.send({count: productCount});
// });

// // Get featured products
// router.get('/get/featured/:count', async (req, res) => {
//     const count = req.params.count ? req.params.count : 4;

//     const products = await Product.find({ isFeatured: true }).limit(+count);

//     if (!products) {
//         res.status(500).json({ success: false });
//     }

//     res.send(products );
// });


// export default router;
