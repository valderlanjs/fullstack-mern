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
import { authenticate } from "../middleware/authenticate.js";

const messageRouter = express.Router();

// 🔐 Rotas protegidas
messageRouter.post('/create', 
  authenticate, 
  checkPermission('manageMarketing'), 
  createMessage
);

messageRouter.post('/toggle', 
  authenticate, 
  checkPermission('manageMarketing'), 
  toggleMessage
);

messageRouter.post('/update', 
  authenticate, 
  checkPermission('manageMarketing'), 
  updateMessage
);

messageRouter.post('/delete', 
  authenticate, 
  checkPermission('manageMarketing'), 
  deleteMessage
);

messageRouter.get('/all', 
  authenticate, 
  checkPermission('manageMarketing'), 
  getAllMessages
);

// 🌐 Rota pública
messageRouter.get('/active', getActiveMessage);

export default messageRouter;