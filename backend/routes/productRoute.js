// routes/productRoute.js
import express from "express";
import { 
  addProduct, 
  listProduct, 
  removeProduct, 
  singleProduct, 
  getProductFilters 
} from "../controllers/productController.js";
import { upload } from "../middleware/multer.js";
import { checkPermission } from "../middleware/permissionAuth.js";
import { authenticate } from "../middleware/authenticate.js"

const productRouter = express.Router();

// 🔐 Rotas protegidas - apenas admin OU com permissão manageProducts
productRouter.post('/add', authenticate, checkPermission('manageProducts'), upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.post('/remove', authenticate, checkPermission('manageProducts'), removeProduct);

// 🌐 Rotas públicas
productRouter.get('/filters', getProductFilters);
productRouter.get('/list', listProduct);
productRouter.get('/:productId', singleProduct);

export default productRouter;