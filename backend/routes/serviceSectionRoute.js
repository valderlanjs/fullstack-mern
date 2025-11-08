// routes/servicesSectionRoute.js
import express from "express";
import {
  getServicesSection,
  getAllServicesSections,
  createOrUpdateServicesSection,
  deleteServicesSection
} from "../controllers/servicesSectionController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const servicesSectionRoute = express.Router();

// Rota pública
servicesSectionRoute.get("/", getServicesSection);

// Rotas administrativas (protegidas)
servicesSectionRoute.get("/admin/all", adminAuth, getAllServicesSections);
servicesSectionRoute.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "section1Image", maxCount: 1 },
    { name: "section2Image", maxCount: 1 }
  ]),
  createOrUpdateServicesSection
);
servicesSectionRoute.delete("/:id", adminAuth, deleteServicesSection);

export default servicesSectionRoute;