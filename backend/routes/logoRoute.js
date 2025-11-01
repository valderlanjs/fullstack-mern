// routes/logoRoute.js
import express from "express";
import { 
  getActiveLogo, 
  getAllLogos, 
  uploadLogo, 
  setActiveLogo, 
  deleteLogo 
} from "../controllers/logoController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const logoRoute = express.Router();

// Rotas públicas
logoRoute.get('/active', getActiveLogo);

// Rotas administrativas
logoRoute.get('/admin/all', getAllLogos);
logoRoute.post('/admin/upload', upload.fields([{ name: 'image', maxCount: 1 }]), uploadLogo);
logoRoute.put('/admin/set-active/:id', setActiveLogo);
logoRoute.delete('/admin/delete/:id', adminAuth, deleteLogo);

export default logoRoute;