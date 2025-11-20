// models/FooterModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Footer = sequelize.define("Footer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Informações da Empresa
  logoUrl: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  copyright: { type: DataTypes.STRING, allowNull: true },
  cnpj: { type: DataTypes.STRING, allowNull: true }, // NOVO CAMPO
  
  // Links Rápidos
  aboutLink: { type: DataTypes.STRING, allowNull: true },
  productsLink: { type: DataTypes.STRING, allowNull: true },
  contactLink: { type: DataTypes.STRING, allowNull: true },
  faqLink: { type: DataTypes.STRING, allowNull: true },
  
  // Informações de Contato
  phone: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  whatsapp: { type: DataTypes.STRING, allowNull: true },
  businessHours: { type: DataTypes.STRING, allowNull: true },
  
  // Redes Sociais
  facebookUrl: { type: DataTypes.STRING, allowNull: true },
  instagramUrl: { type: DataTypes.STRING, allowNull: true },
  
  // Textos dos Títulos
  quickLinksTitle: { type: DataTypes.STRING, allowNull: true, defaultValue: "Links Rápidos" },
  contactTitle: { type: DataTypes.STRING, allowNull: true, defaultValue: "Contate-nos" },
  socialTitle: { type: DataTypes.STRING, allowNull: true, defaultValue: "Nossas Redes Sociais" }
}, {
  tableName: 'footers',
  timestamps: true
});

export default Footer;