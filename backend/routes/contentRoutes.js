import express from 'express';
import multer from 'multer';
import { uploadContent, uploadFromURL } from '../controllers/contentController.js';
import GeneratedContent from '../models/GeneratedContent.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🔍 GET: Fetch all generated content
router.get('/generated', async (req, res) => {
  try {
    const data = await GeneratedContent.findAll({ order: [['createdAt', 'DESC']] });
    res.json(data);
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch generated content' });
  }
});

// 📤 POST: Upload from file
router.post('/upload', upload.single('file'), uploadContent);

// 🔗 POST: Upload from YouTube URL
router.post('/upload-url', uploadFromURL);

export default router;
