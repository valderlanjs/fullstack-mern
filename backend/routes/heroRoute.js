import express from "express";
import { getHeroImage, updateHeroImage } from "../controllers/heroController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const heroRouter = express.Router();

heroRouter.get('/image', getHeroImage);
heroRouter.post('/update', adminAuth, upload.fields([{ name: 'image', maxCount: 1 }]), updateHeroImage);

export default heroRouter;
