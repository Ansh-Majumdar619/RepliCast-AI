// ✅ Sequelize model to store generated content (threads, hashtags, blogs, videos, etc.) with performance tracking
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const GeneratedContent = sequelize.define('GeneratedContent', {
  // Content type: video, audio, text, etc.
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Raw or stringified AI-generated summary result
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // ✅ Full structured result (JSON format)
  result: {
    type: DataTypes.JSONB, // Use JSON for structured AI output
    allowNull: true,
  },

  // Optional: Number of impressions (mocked or real)
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  // Optional: Number of clicks (mocked or real)
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  // Optional: Engagement rate (%) - float value
  engagementRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },

  // Optional: Scheduled time for posting
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default GeneratedContent;
