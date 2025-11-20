import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const MarketingMessage = sequelize.define('MarketingMessage', {
  message: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  backgroundColor: { 
    type: DataTypes.STRING, 
    defaultValue: '#22c55e' // verde padrão
  },
  textColor: { 
    type: DataTypes.STRING, 
    defaultValue: '#ffffff' 
  },
  buttonText: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  buttonLink: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  tableName: 'marketing_messages',
});

export default MarketingMessage;