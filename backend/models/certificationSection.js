// models/CertificationSection.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const CertificationSection = sequelize.define("CertificationSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // FSC Section
  fscImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fscTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "FSC"
  },
  fscDescription1: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Certificação Forest Stewardship Council. Atribuída por certificadores independentes que estabelecem princípios e critérios para assegurar a origem da madeira."
  },
  fscDescription2: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Permitindo ao consumidor consciente a opção de um produto que não degrada o meio ambiente e contribui para o desenvolvimento social e econômico das comunidades florestais."
  },
  fscImageAlt: {
    type: DataTypes.STRING,
    defaultValue: "Certificação FSC"
  },
  // DOF Section
  dofImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dofTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "DOF"
  },
  dofDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Documento de origem florestal, garantindo procedência, manejo responsável e qualidade do produto."
  },
  dofImageAlt: {
    type: DataTypes.STRING,
    defaultValue: "Certificação DOF"
  }
}, {
  tableName: 'certification_sections',
  timestamps: true
});