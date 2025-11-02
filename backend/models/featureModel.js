// models/FeaturesModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Features = sequelize.define("Features", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Título e descrição principal
  title: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "Sustentabilidade e qualidade"
  },
  subtitle: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    defaultValue: "Madeira sustentável, certificada pelo FSC garantindo qualidade, preservação ambiental e benefícios sociais para comunidades florestais."
  },
  
  // Card 1 - FSC
  card1Title: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "FSC"
  },
  card1Content: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    defaultValue: "Certificado internacional que assegura a procedência, qualidade e respeito ao meio ambiente.\n\nCom nossas práticas a exploração predatórias é eliminada e a biodiversidade e os recursos hídricos e do solo são preservados."
  },
  
  // Card 2 - DOF
  card2Title: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "DOF"
  },
  card2Content: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    defaultValue: "Comercializamos madeira nativa com o Documento de Origem Florestal (DOF) emitido pelo Ibama, garantindo a rastreabilidade e a legalidade da madeira.\n\nEscolha nossos produtos e faça parte de um consumo consciente que promove o desenvolvimento social e econômico das comunidades florestais."
  },
  
  // Cores
  backgroundColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#f3f4f6"
  },
  titleColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#000000"
  },
  subtitleColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#6b7280"
  },
  cardBackgroundColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#ffffff"
  },
  cardTitleColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#16a34a"
  },
  cardTextColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#000000"
  },
  iconColor: { 
    type: DataTypes.STRING, 
    allowNull: true,
    defaultValue: "#16a34a"
  }
}, {
  tableName: 'features',
  timestamps: true
});

export default Features;