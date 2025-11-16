// routes/sectionRoute.js
import express from "express";
import {
  getSections,
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  reorderSections
} from "../controllers/sectionController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const sectionRoute = express.Router();

// Rotas públicas
sectionRoute.get("/", getSections);
sectionRoute.get("/:id", getSectionById);

// Rotas administrativas (protegidas)
sectionRoute.get("/admin/all",  getAllSections);
sectionRoute.post(
  "/",
    upload.fields([{ name: "image", maxCount: 1 }]),
  createSection
);
sectionRoute.put(
  "/:id",
  
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateSection
);
sectionRoute.delete("/:id",  deleteSection);
sectionRoute.put("/admin/reorder",  reorderSections);

export default sectionRoute;