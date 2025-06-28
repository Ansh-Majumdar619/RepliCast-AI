// ✅ Sequelize model for job tracking
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ContentJob = sequelize.define('ContentJob', {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  result: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default ContentJob;
