// models/HomeSectionModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const HomeSection = sequelize.define("HomeSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Conteúdo principal
  title: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "Bem-vindo ao Grupo Madenobre! No mercado desde 1998"
  },
  highlightedText: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "desde 1998"
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    defaultValue: "Há mais de 25 anos, somos referência no mercado de madeiras de alta qualidade em Maceió, somos a solução para seus projetos. Explore nosso site e descubra como podemos ajudar a transformar suas ideias em realidade."
  },
  buttonText: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "Sobre Nós"
  },
  buttonLink: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "/about"
  },
  
  // Cores em formato hexadecimal
  backgroundColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#ffffff"
  },
  textColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#000000"
  },
  highlightColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#16a34a" // verde secondary
  },
  buttonColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#16a34a"
  },
  buttonTextColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#ffffff"
  }
}, {
  tableName: 'home_sections',
  timestamps: true
});

export default HomeSection;