import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";


const Hero = sequelize.define('Hero', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'heros',
  timestamps: false,
});

export default Hero;

/*
/*import mongoose from "mongoose"
const heroSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true}
});

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;*/