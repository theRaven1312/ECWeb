import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
});

categorySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});


export default mongoose.model('Category', categorySchema);

