// models/productModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: true, // Pode ser nulo para usar descrição padrão
        defaultValue: null 
    },
    category: { type: DataTypes.STRING, allowNull: false },
    subCategory: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.JSON, allowNull: false },
    popular: { type: DataTypes.BOOLEAN },
}, {
    tableName: 'products',
});

export default Product;