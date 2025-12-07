// routes/whatsappRoute.js
import express from "express";
import { 
  getWhatsAppConfig, 
  updateWhatsAppConfig 
} from "../controllers/whatsappController.js";
import { authenticate } from "../middleware/authenticate.js";
import { checkPermission } from "../middleware/permissionAuth.js";

const whatsappRouter = express.Router();

// Rota pública para pegar configuração
whatsappRouter.get('/config', getWhatsAppConfig);

// Rota protegida para atualizar (apenas admin ou com permissão)
whatsappRouter.post('/update-config', 
  authenticate, 
  checkPermission('manageVendors'), 
  updateWhatsAppConfig
);

export default whatsappRouter;