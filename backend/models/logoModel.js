// models/logoModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Logo = sequelize.define('Logo', {
  imageUrl: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  altText: { 
    type: DataTypes.STRING, 
    defaultValue: "Logo da empresa" 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'logos',
  timestamps: true, // Mantenha true para created_at e updated_at
});

export default Logo;