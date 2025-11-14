// routes/faqRoutes.js
import express from 'express';
import {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  moveFaq
} from '../controllers/faqController.js';
import  adminAuth  from '../middleware/adminAuth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getFaqs);

// Rotas protegidas (admin)
router.post('/',  createFaq);
router.put('/:id', adminAuth, updateFaq);
router.delete('/:id', adminAuth, deleteFaq);
router.put('/:id/move',adminAuth,  moveFaq);

export default router;