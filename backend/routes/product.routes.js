import express from 'express';
import Product from '../models/product.model.js';
const router = express.Router();

router.post(`/`, (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        image_url: req.body.image_url,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category
    });

    product.save()
    .then((result) => {
        res.status(201).json({
            message: 'Product created successfully',
            product: result
        });
    })
    .catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    })
})

router.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList) {
        res.status(500).json({success:false});
    }
    console.log(productList);
    res.send(productList);
})

export default router;
