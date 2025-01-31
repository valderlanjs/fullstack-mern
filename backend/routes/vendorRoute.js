import express from "express";
import { addVendor, listVendors, updateVendor, removeVendor } from "../controllers/vendorController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const vendorRouter = express.Router();

vendorRouter.post('/add', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), addVendor);
vendorRouter.get('/list', listVendors);
vendorRouter.post('/update', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), updateVendor);
vendorRouter.post('/remove', adminAuth, removeVendor);

export default vendorRouter;
