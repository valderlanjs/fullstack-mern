import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const Banner = sequelize.define('Banner', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'banners',
  timestamps: false,
});

export default Banner;
