import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/mysql.js";

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false  },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    timestamps: false,
    tableName: 'users',
});

export default User;
/*
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
export default User;
*/