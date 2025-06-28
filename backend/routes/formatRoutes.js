// ✅ Route for getting processed formats
import express from 'express';
import { getFormats } from '../controllers/formatController.js';

const router = express.Router();
router.get('/', getFormats);

export default router;
