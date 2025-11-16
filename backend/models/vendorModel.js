import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Vendor = sequelize.define('Vendor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  image: { type: DataTypes.STRING, allowNull: false },
  whatsapp: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'vendors',
});

export default Vendor;
