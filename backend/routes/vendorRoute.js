import express from "express";
import { addVendor, listVendors, updateVendor, removeVendor } from "../controllers/vendorController.js";
import upload from "../middleware/multer.js";

const vendorRouter = express.Router();

vendorRouter.post('/add', upload.fields([{ name: 'image', maxCount: 1 }]), addVendor);
vendorRouter.get('/list', listVendors);
vendorRouter.post('/update', upload.fields([{ name: 'image', maxCount: 1 }]), updateVendor);
vendorRouter.post('/remove', removeVendor);

export default vendorRouter;
