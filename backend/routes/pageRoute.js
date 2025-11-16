// routes/pageRoute.js
import express from 'express';
import {
  getPageBySlug,
  getPages,
  updatePage,
  seedPages
} from '../controllers/pageController.js';
import adminAuth from '../middleware/adminAuth.js';
import { checkPermission } from '../middleware/permissionAuth.js';

const router = express.Router();

// 🌐 Rotas públicas
router.get('/:slug', getPageBySlug);

// 🔐 Rotas protegidas - apenas admin OU com permissão managePrivacyTerms
router.get('/', adminAuth, checkPermission('managePrivacyTerms'), getPages);
router.put('/:id', adminAuth, checkPermission('managePrivacyTerms'), updatePage);
router.post('/seed', adminAuth, checkPermission('managePrivacyTerms'), seedPages);

export default router;