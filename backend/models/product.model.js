import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    colors: [{ type: String }],
    sizes: [{ type: String }], // Thêm trường sizes
    description: { type: String, default: '' },
    image_url: { type: String },
    images: [{ type: String }],
    brand: { type: String, default: '' },
    price: { type: Number, default: 0, required: true, min: 0 },
    stock: { type: Number, default: 0, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    coupon: { type: String, default: '' },
    dateCreated: { type: Date, default: Date.now },
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Product', productSchema);
