// routes/heroRoute.js
import express from "express";
import { getHeroImages, addHero, updateHeroTexts, deleteHero } from "../controllers/heroController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const heroRouter = express.Router();

heroRouter.get("/image", getHeroImages);

heroRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addHero
);

heroRouter.put("/:id/texts", adminAuth, updateHeroTexts);

heroRouter.delete("/:id", adminAuth, deleteHero);

export default heroRouter;