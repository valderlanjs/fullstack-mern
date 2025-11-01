import express from "express";
import { getHeroImages, addHero, deleteHero } from "../controllers/heroController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const heroRouter = express.Router();

heroRouter.get("/image", getHeroImages);

heroRouter.post(
  "/add",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addHero
);

heroRouter.delete("/:id", adminAuth, deleteHero);

export default heroRouter;
