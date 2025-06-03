import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    colors: [{type: String}],
    sizes: [{type: String}], // Thêm trường sizes
    description: {type: String, default: ""},
    image_url: {type: String},
    images: [{type: String}],
    brand: {type: String, default: ""},
    price: {type: Number, default: 0, required: true, min: 0},
    discount: {type: Number, default: 0, min: 0, max: 100}, // Discount percentage
    stock: {type: Number, default: 0, required: true, min: 0},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    rating: {type: Number, default: 0, min: 0, max: 5},
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: "reviews"}],
    numReviews: {type: Number, default: 0},
    isFeatured: {type: Boolean, default: false},
    isSale: {type: Boolean, default: false},
    dateCreated: {type: Date, default: Date.now},
    isSold: {type: Number, default: 0},
});

export default mongoose.model("products", productSchema);
