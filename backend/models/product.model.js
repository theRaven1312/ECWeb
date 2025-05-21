import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    id: {type: String, required: true},
    name: { type: String, required: true },
    description: { type: String, },
    image_url: {type: String},
    price : {type: Number, required: true},
    stock : {type: Number, required: true},
    category : {type: String,}
})

export default mongoose.model('Product', productSchema);
