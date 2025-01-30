//import mongoose from "mongoose";
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/mysql.js";

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false},
}, {
    timestamps: false,
    tableName: 'users',
});

export default User;

