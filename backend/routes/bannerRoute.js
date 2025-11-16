import express from "express";
import { getBannerImage, updateBannerImage } from "../controllers/bannerController.js";
import { upload, handleMulterError } from "../middleware/multer.js";


const bannerRouter = express.Router();

bannerRouter.get('/image', getBannerImage);
bannerRouter.post('/update',  
  upload.fields([{ name: 'image', maxCount: 1 }]),
  handleMulterError, // Adicione este middleware
  updateBannerImage
);

export default bannerRouter;