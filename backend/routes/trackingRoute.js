import express from "express";
import { 
  createTrackingCode, 
  getActiveTrackingCodes, 
  getAllTrackingCodes, 
  toggleTrackingCode, 
  updateTrackingCode, 
  deleteTrackingCode 
} from "../controllers/trackingControllers.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from "../middleware/permissionAuth.js";

const trackingRouter = express.Router();

// 🔐 Rotas protegidas
trackingRouter.post('/create', 
  adminAuth, 
  checkPermission('manageTracking'), 
  createTrackingCode
);

trackingRouter.post('/toggle', 
  adminAuth, 
  checkPermission('manageTracking'), 
  toggleTrackingCode
);

trackingRouter.post('/update', 
  adminAuth, 
  checkPermission('manageTracking'), 
  updateTrackingCode
);

trackingRouter.post('/delete', 
  adminAuth, 
  checkPermission('manageTracking'), 
  deleteTrackingCode
);

trackingRouter.get('/all', 
  adminAuth, 
  checkPermission('manageTracking'), 
  getAllTrackingCodes
);

// 🌐 Rota pública (para o frontend buscar códigos ativos)
trackingRouter.get('/active', getActiveTrackingCodes);

export default trackingRouter;