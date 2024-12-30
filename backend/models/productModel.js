import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true},
    image: {type: Array, required: true},
    popular: {type: Boolean},

})


const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;