// models/Card.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Card = sequelize.define("Card", {
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: true },
  sectionId: { type: DataTypes.INTEGER, allowNull: true },
});

export default Card;
