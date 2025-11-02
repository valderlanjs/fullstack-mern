// routes/FeaturesRoute.js
import express from "express";
import {
  createOrUpdateFeatures,
  getFeatures,
  resetFeatures
} from "../controllers/featureController.js";
import adminAuth from "../middleware/adminAuth.js";

const featuresRoute = express.Router();

// Rotas públicas
featuresRoute.get("/", getFeatures);

// Rotas administrativas (protegidas)
featuresRoute.post("/", adminAuth, createOrUpdateFeatures);
featuresRoute.delete("/", adminAuth, resetFeatures);

export default featuresRoute;