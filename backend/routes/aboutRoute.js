// routes/aboutSectionRoute.js
import express from "express";
import {
  getAboutSection,
  getAllAboutSections,
  createOrUpdateAboutSection,
  deleteAboutSection
} from "../controllers/aboutController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const aboutSectionRoute = express.Router();

// Rota pública
aboutSectionRoute.get("/", getAboutSection);

// Rotas administrativas (protegidas)
aboutSectionRoute.get("/admin/all",  getAllAboutSections);
aboutSectionRoute.post(
  "/",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createOrUpdateAboutSection
);
aboutSectionRoute.delete("/:id",  deleteAboutSection);

export default aboutSectionRoute;