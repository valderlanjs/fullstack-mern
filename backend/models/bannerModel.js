import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Banner = sequelize.define('Banner', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'banners',
  timestamps: false,
});

export default Banner;
/*
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;

*/