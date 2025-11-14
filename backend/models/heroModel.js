// models/heroModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Hero = sequelize.define('Hero', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  badgeText: { 
    type: DataTypes.STRING, 
    allowNull: true, // Alterado para true
    defaultValue: null // Alterado para null
  },
  title: { 
    type: DataTypes.TEXT, 
    allowNull: true, // Alterado para true
    defaultValue: null // Alterado para null
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true, // Alterado para true
    defaultValue: null // Alterado para null
  },
  button1Text: { 
    type: DataTypes.STRING, 
    allowNull: true, // Alterado para true
    defaultValue: null // Alterado para null
  },
  button2Text: { 
    type: DataTypes.STRING, 
    allowNull: true, // Alterado para true
    defaultValue: null // Alterado para null
  },
  button1Link: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "/contact"
  },
  button2Link: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "/collection"
  },
  gradientWord: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  gradientColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "#70BD44"
  },
  showButtons: { // Novo campo para controlar visibilidade dos botões
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  showTexts: { // Novo campo para controlar visibilidade dos textos
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  buttonsPosition: { // Novo campo para controlar posição dos botões
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "bottom-left" // bottom-left, bottom-center, bottom-right
  }
}, {
  tableName: 'heros',
  timestamps: false,
});

export default Hero;