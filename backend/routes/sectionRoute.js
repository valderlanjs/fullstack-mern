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
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const sectionRoute = express.Router();

// Rotas públicas
sectionRoute.get("/", getSections);
sectionRoute.get("/:id", getSectionById);

// Rotas administrativas (protegidas)
sectionRoute.get("/admin/all", adminAuth, getAllSections);
sectionRoute.post(
  "/",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createSection
);
sectionRoute.put(
  "/:id",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateSection
);
sectionRoute.delete("/:id", adminAuth, deleteSection);
sectionRoute.put("/admin/reorder", adminAuth, reorderSections);

export default sectionRoute;