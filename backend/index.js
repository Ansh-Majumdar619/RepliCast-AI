// ✅ Entry point of the Express server
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import contentRoutes from './routes/contentRoutes.js';
import formatRoutes from './routes/formatRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

import { sequelize, connectDB } from './config/db.js';
import { setupQueues } from './config/queueConfig.js';
import { startSchedulers } from './services/schedulerService.js';

import ContentJob from './models/ContentJob.js';
import GeneratedContent from './models/GeneratedContent.js'; // Register model

// ✅ Load .env variables
dotenv.config();

const app = express();
const __dirname = path.resolve();

// ✅ Enable frontend connection
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Serve uploaded video/audio/text files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // fix for CORB
  next();
}, express.static(path.join(__dirname, 'uploads')));


// ✅ Main API Routes
app.use('/api/content', contentRoutes);
app.use('/api/formats', formatRoutes);
app.use('/api/jobs', jobRoutes);

// ✅ Start background cron jobs
startSchedulers();

// ✅ Init DB + Redis Queues
const startServer = async () => {
  await connectDB();
  // await sequelize.sync(); // set { force: true } to reset tables
  await sequelize.sync({ alter: true });


  setupQueues();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
