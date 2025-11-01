import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const CardSection = sequelize.define("CardSection", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default CardSection;
