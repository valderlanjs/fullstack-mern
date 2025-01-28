//import mongoose from "mongoose";
import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
}, {
    tableName: 'users',
});

export default User;












/*
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;*/