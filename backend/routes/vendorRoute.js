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
import { authenticate } from "../middleware/authenticate.js"

const vendorRouter = express.Router();

// 🔐 Rotas protegidas - apenas admin OU com permissão manageVendors
vendorRouter.post('/add', 
  authenticate, 
  checkPermission('manageVendors'), 
  upload.fields([{ name: 'image', maxCount: 1 }]),
  handleMulterError, // Adicione este middleware após o upload
  addVendor
);

vendorRouter.post('/update', 
  authenticate, 
  checkPermission('manageVendors'), 
  upload.fields([{ name: 'image', maxCount: 1 }]),
  handleMulterError, // Adicione este middleware após o upload
  updateVendor
);

vendorRouter.post('/remove', 
  authenticate, 
  checkPermission('manageVendors'), 
  removeVendor
);

// 🌐 Rotas públicas
vendorRouter.get('/list', listVendors);

export default vendorRouter;