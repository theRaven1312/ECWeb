import Category from "../models/category.model.js";
import express from "express";
const router = express.Router();
import * as CategoryController from "../controllers/category.controller.js";

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;


// // Get all categories
// router.get("/", async (req, res) => {
//     try {
//         const categories = await Category.find();
//         res.status(200).json(categories);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get category by ID
// router.get(`/:id`, async (req, res) => {
//     const category = await Category.findById(req.params.id);
//     if(!category) 
//     return res.status(500).json({ success: false, message: "The category with the given ID was not found!" });
//     res.status(200).send(category);
// })

// // Update category by ID
// router.put(`/:id`, async (req, res) => {
//     const category = await Category.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             image_url: req.body.image_url,
//         },
//         { new: true }
//     );
//     if (!category) return res.status(500).send("The category cannot be updated!");
//     res.status(200).send(category);
// })


// // Create new category
// router.post("/", async (req, res) => {
//     let category = new Category({
//         name: req.body.name,
//         description: req.body.description,
//         image_url: req.body.image_url,
//     })

//     category = await category.save();
//     if (!category) return res.status(500).send("The category cannot be created!");
//     res.status(200).send(category);
// });

// // Delete category by ID
// router.delete(`/:id`, async (req, res) => {
//     Category.findByIdAndDelete(req.params.id).then((category) => {
//         if (category) {
//             return res.status(200).json({ success: true, message: "The category is deleted!" });
//         } else {
//             return res.status(404).json({ success: false, message: "category not found!" });
//         }
//     }).catch((err) => {
//         return res.status(500).json({ success: false, error: err });
//     });
// });

// export default router;
