// models/userModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  permissions: { 
    type: DataTypes.JSON, 
    defaultValue: {
      managePrivacyTerms: false,
      manageProducts: false,
      manageVendors: false,
      manageMarketing: false,
    }
  }
}, {
  timestamps: false,
  tableName: "Users", 
});

export default User;