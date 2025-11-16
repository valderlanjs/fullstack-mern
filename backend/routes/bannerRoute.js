import express from "express";
import { getBannerImage, updateBannerImage } from "../controllers/bannerController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const bannerRouter = express.Router();

bannerRouter.get('/image', getBannerImage);
bannerRouter.post('/update',  upload.fields([{ name: 'image', maxCount: 1 }]), updateBannerImage);

export default bannerRouter;
