import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const ServicesSection = sequelize.define("ServicesSection", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Seção 1
  section1Title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "O que nós oferecemos"
  },
  section1Description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "Descrição dos serviços oferecidos"
  },
  section1Image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section1ImageAlt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Serviços oferecidos"
  },
  // Seção 2
  section2Title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Nós nos concentramos em todos os detalhes"
  },
  section2Image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section2ImageAlt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Detalhes e qualidade"
  },
  // CTA
  ctaText: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Faça um orçamento"
  },
  ctaLink: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "/contact"
  },
  // Serviços (armazenados como JSON)
  services: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [
      {
        title: "Corte sob medida",
        description: "Seja para construção ou reforma, nossa equipe especializada te auxilia na escolha da madeira ideal para o seu projeto, com corte sob medida."
      },
      {
        title: "Madeira da melhor qualidade", 
        description: "Com a qualidade incontestável de nossos produtos. Tudo o que você precisa para transformar sua ideia em realidade, reunidos em um só lugar."
      }
    ]
  },
  // Diferenciais (armazenados como JSON)
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [
      {
        title: "Atendimento",
        description: "Atendimento excepcional do início ao fim. Sua satisfação é nossa prioridade."
      },
      {
        title: "Qualidade",
        description: "Qualidade incomparável em cada pedaço de madeira que entregamos."
      },
      {
        title: "Entrega", 
        description: "Entrega rápida e segura em cada canto. Pontualidade e cuidado em cada passo do trajeto."
      }
    ]
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'services_sections',
  timestamps: true
});

export default ServicesSection;