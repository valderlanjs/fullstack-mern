// routes/productRoute.js
import express from "express";
import { 
  addProduct, 
  listProduct, 
  removeProduct, 
  singleProduct, 
  getProductFilters 
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from "../middleware/permissionAuth.js";

const productRouter = express.Router();

// 🔐 Rotas protegidas - apenas admin OU com permissão manageProducts
productRouter.post('/add', adminAuth, checkPermission('manageProducts'), upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.post('/remove', adminAuth, checkPermission('manageProducts'), removeProduct);

// 🌐 Rotas públicas
productRouter.get('/filters', getProductFilters);
productRouter.get('/list', listProduct);
productRouter.get('/:productId', singleProduct);

export default productRouter;