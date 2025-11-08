// models/sectionModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Section = sequelize.define("Section", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  buttonText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  buttonLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imagePosition: {
    type: DataTypes.ENUM('left', 'right'),
    defaultValue: 'left'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageAlt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'sections',
  timestamps: true
});

export default Section;