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
import { authenticate } from "../middleware/authenticate.js"

const trackingRouter = express.Router();

// 🔐 Rotas protegidas
trackingRouter.post('/create', 
  authenticate, 
  checkPermission('manageMarketing'), 
  createTrackingCode
);

trackingRouter.post('/toggle', 
  authenticate, 
  checkPermission('manageMarketing'), 
  toggleTrackingCode
);

trackingRouter.post('/update', 
  authenticate, 
  checkPermission('manageMarketing'), 
  updateTrackingCode
);

trackingRouter.post('/delete', 
  authenticate, 
  checkPermission('manageMarketing'), 
  deleteTrackingCode
);

trackingRouter.get('/all', 
  authenticate, 
  checkPermission('manageMarketing'), 
  getAllTrackingCodes
);

// 🌐 Rota pública (para o frontend buscar códigos ativos)
trackingRouter.get('/active', getActiveTrackingCodes);

export default trackingRouter;