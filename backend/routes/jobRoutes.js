// routes/jobRoutes.js
import express from 'express';
import ContentJob from '../models/ContentJob.js';

const router = express.Router();

// GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await ContentJob.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) {
    console.error('❌ Failed to fetch jobs:', err.message);
    res.status(500).json({ error: 'Failed to fetch job data' });
  }
});

export default router;
