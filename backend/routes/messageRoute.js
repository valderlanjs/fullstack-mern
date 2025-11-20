import express from "express";
import { 
  createMessage, 
  getActiveMessage, 
  toggleMessage, 
  getAllMessages, 
  updateMessage, 
  deleteMessage 
} from "../controllers/messageController.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from "../middleware/permissionAuth.js";

const messageRouter = express.Router();

// 🔐 Rotas protegidas
messageRouter.post('/create', 
  adminAuth, 
  checkPermission('manageMarketing'), 
  createMessage
);

messageRouter.post('/toggle', 
  adminAuth, 
  checkPermission('manageMarketing'), 
  toggleMessage
);

messageRouter.post('/update', 
  adminAuth, 
  checkPermission('manageMarketing'), 
  updateMessage
);

messageRouter.post('/delete', 
  adminAuth, 
  checkPermission('manageMarketing'), 
  deleteMessage
);

messageRouter.get('/all', 
  adminAuth, 
  checkPermission('manageMarketing'), 
  getAllMessages
);

// 🌐 Rota pública
messageRouter.get('/active', getActiveMessage);

export default messageRouter;