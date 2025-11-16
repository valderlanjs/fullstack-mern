// routes/servicesSectionRoute.js
import express from "express";
import {
  getServicesSection,
  getAllServicesSections,
  createOrUpdateServicesSection,
  deleteServicesSection
} from "../controllers/servicesSectionController.js";
import upload from "../middleware/multer.js";


const servicesSectionRoute = express.Router();

// Rota pública
servicesSectionRoute.get("/", getServicesSection);

// Rotas administrativas (protegidas)
servicesSectionRoute.get("/admin/all", getAllServicesSections);
servicesSectionRoute.post(
  "/",
  
  upload.fields([
    { name: "section1Image", maxCount: 1 },
    { name: "section2Image", maxCount: 1 }
  ]),
  createOrUpdateServicesSection
);
servicesSectionRoute.delete("/:id",  deleteServicesSection);

export default servicesSectionRoute;