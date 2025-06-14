import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";
import mongoose from "mongoose"
/*
const Hero = sequelize.define('Hero', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'heros',
  timestamps: false,
});

export default Hero;
*/

const heroSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true}
});

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;