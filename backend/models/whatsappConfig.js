// models/WhatsAppConfig.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const WhatsAppConfig = sequelize.define('WhatsAppConfig', {
  phone_number: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true 
  },
  default_message: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    defaultValue: "Olá! Gostaria de mais informações sobre seus produtos." 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    allowNull: false,
    defaultValue: true 
  }
}, {
  tableName: 'whatsapp_config',
  timestamps: true
});

export default WhatsAppConfig;