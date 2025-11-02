// routes/HomeSectionRoute.js
import express from "express";
import {
  createOrUpdateHomeSection,
  getHomeSection,
  resetHomeSection
} from "../controllers/homeSectionController.js";
import adminAuth from "../middleware/adminAuth.js";

const homeSectionRoute = express.Router();

// Rotas públicas
homeSectionRoute.get("/", getHomeSection);

// Rotas administrativas (protegidas)
homeSectionRoute.post("/", adminAuth, createOrUpdateHomeSection);
homeSectionRoute.delete("/", adminAuth, resetHomeSection);

export default homeSectionRoute;