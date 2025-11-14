// routes/pageRoutes.js
import express from 'express';
import {
  getPageBySlug,
  getPages,
  updatePage,
  seedPages
} from '../controllers/pageController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Rotas públicas
router.get('/:slug', getPageBySlug);

// Rotas protegidas (admin)
router.get('/', adminAuth, getPages);
router.put('/:id', adminAuth, updatePage);
router.post('/seed', adminAuth, seedPages);

export default router;