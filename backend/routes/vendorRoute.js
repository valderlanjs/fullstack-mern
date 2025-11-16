import express from "express";
import { 
  addVendor, 
  listVendors, 
  updateVendor, 
  removeVendor 
} from "../controllers/vendorController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from "../middleware/permissionAuth.js";

const vendorRouter = express.Router();

// 🔐 Rotas protegidas - apenas admin OU com permissão manageVendors
vendorRouter.post('/add', 
  adminAuth, 
  checkPermission('manageVendors'), 
  upload.fields([{ name: 'image', maxCount: 1 }]),
  handleMulterError, // Adicione este middleware após o upload
  addVendor
);

vendorRouter.post('/update', 
  adminAuth, 
  checkPermission('manageVendors'), 
  upload.fields([{ name: 'image', maxCount: 1 }]),
  handleMulterError, // Adicione este middleware após o upload
  updateVendor
);

vendorRouter.post('/remove', 
  adminAuth, 
  checkPermission('manageVendors'), 
  removeVendor
);

// 🌐 Rotas públicas
vendorRouter.get('/list', listVendors);

export default vendorRouter;