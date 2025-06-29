import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const Vendor = sequelize.define('Vendor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.STRING, allowNull: false },
  whatsapp: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'vendors',
});

export default Vendor;
/*
import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  whatsapp: { type: String }
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;*/