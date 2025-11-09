// routes/AboutBannerRoute.js
import express from "express";
import { 
  getAboutBannerSection, 
  updateAboutBannerSection,
  resetAboutBannerSection 
} from "../controllers/AboutBannerController.js";
import upload from "../middleware/multer.js";

const AboutBannerRouter = express.Router();

AboutBannerRouter.get("/", getAboutBannerSection);
AboutBannerRouter.put("/", 
  upload.fields([
    { name: 'heroBackgroundImage', maxCount: 1 },
    { name: 'contentImage', maxCount: 1 }
  ]), 
  updateAboutBannerSection
);
AboutBannerRouter.post("/reset", resetAboutBannerSection);

export default AboutBannerRouter;