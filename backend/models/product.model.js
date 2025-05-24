import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, default: ''},
    description: { type: String, default: ''},
    richDescription: { type: String, default: ''},
    image_url: {type: String},
    images: [{type:String}],
    brand: {type: String, default: ''},
    price : {type: Number, default: 0, required: true, min: 0},
    stock : {type: Number, default:0,  required: true, min: 0},
    category : {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    rating: {type: Number},
    numReviews: {type: Number, default: 0},
    isFeatured: {type: Boolean, default: false},
    isSale : {type: Boolean, default: false},
    dateCreated: {type: Date, default: Date.now}, 
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

export default mongoose.model('Product', productSchema);
