import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Hero = sequelize.define('Hero', {
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  badgeText: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: "Madeiras Premium" 
  },
  title: { 
    type: DataTypes.TEXT, 
    allowNull: false, 
    defaultValue: "O melhor em <span style=\"background: linear-gradient(135deg, #70BD44, #8CE563); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;\">madeiras</span> você encontra aqui!" 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false, 
    defaultValue: "Qualidade, variedade e atendimento especializado para atender todas as suas necessidades em madeiras." 
  },
  button1Text: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: "Faça um orçamento" 
  },
  button2Text: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    defaultValue: "Ver Produtos" 
  },
}, {
  tableName: 'heros',
  timestamps: false,
});

export default Hero;

