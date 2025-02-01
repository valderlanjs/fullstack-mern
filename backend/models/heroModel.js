import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const Hero = sequelize.define('Hero', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'heros',
  timestamps: false,
});

export default Hero;
