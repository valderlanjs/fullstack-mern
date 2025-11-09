// models/AboutBannerModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const AboutBannerSection = sequelize.define("AboutBannerSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  heroTitle: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Nosso objetivo é agregar valor para lares e construções"
  },
  heroBackgroundImage: {
    type: DataTypes.STRING,
    allowNull: true // Permite null para funcionar com o padrão do exemplo
  },
  contentBadge: {
    type: DataTypes.STRING,
    defaultValue: "Sustentabilidade"
  },
  contentTitle: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Promovemos a sustentabilidade e preservação do meio ambiente."
  },
  contentDescription: {
    type: DataTypes.TEXT
  },
  contentImage: {
    type: DataTypes.STRING,
    allowNull: true // Permite null para funcionar com o padrão do exemplo
  },
  contentImageAlt: {
    type: DataTypes.STRING,
    defaultValue: "Imagem sobre sustentabilidade"
  }
}, {
  tableName: 'about_banner_sections',
  timestamps: true
});