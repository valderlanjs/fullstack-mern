import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";


const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    subCategory: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.JSON, allowNull: false },
    popular: { type: DataTypes.BOOLEAN },
}, {
    tableName: 'products',
});

export default Product;

/*
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  image: { type: [mongoose.Schema.Types.Mixed], required: true }, // ou [String] se forem URLs
  popular: { type: Boolean, default: false }
});

const Product = mongoose.model('Product', productSchema);
export default Product;*/




/*
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true},
    image: {type: Array, required: true},
    popular: {type: Boolean},

})


const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;*/