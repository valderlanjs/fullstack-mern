import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const TrackingCode = sequelize.define('TrackingCode', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  platform: { 
    type: DataTypes.ENUM('meta', 'google', 'other'),
    allowNull: false
  },
  codeType: { 
    type: DataTypes.ENUM('pixel', 'tag_manager', 'analytics', 'ads', 'conversion', 'custom'),
    allowNull: false
  },
  code: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  position: { 
    type: DataTypes.ENUM('head', 'body'),
    defaultValue: 'head'
  },
  description: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, {
  tableName: 'tracking_codes',
});

export default TrackingCode;