// models/NewsletterModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Newsletter = sequelize.define("Newsletter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  subscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'newsletters',
  timestamps: true,
  updatedAt: false
});

export default Newsletter;