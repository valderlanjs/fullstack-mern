// models/aboutSection.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const AboutSection = sequelize.define("AboutSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Grupo Madenobre"
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageAlt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Sobre o Grupo Madenobre"
  },
  button1Text: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Saiba Mais"
  },
  button1Link: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "/sobre"
  },
  button2Text: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Contato"
  },
  button2Link: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "/contato"
  },
  // NOVOS CAMPOS PARA ESTATÍSTICAS
  stat1Number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "25+"
  },
  stat1Label: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Anos"
  },
  stat2Number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "500+"
  },
  stat2Label: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Projetos"
  },
  stat3Number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "100%"
  },
  stat3Label: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Qualidade"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'about_sections',
  timestamps: true
});

export default AboutSection;