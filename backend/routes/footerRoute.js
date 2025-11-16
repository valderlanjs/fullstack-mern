// routes/FooterRoute.js
import express from "express";
import {
  createOrUpdateFooter,
  getFooter,
  resetFooter
} from "../controllers/footerController.js";
import { upload, handleMulterError } from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const footerRoute = express.Router();

// Rotas públicas
footerRoute.get("/", getFooter);

// Rotas administrativas (protegidas)
footerRoute.post(
  "/",
  adminAuth,
  upload.fields([
    { name: "logo", maxCount: 1 }
  ]),
  createOrUpdateFooter
);

footerRoute.delete("/", adminAuth, resetFooter);

export default footerRoute;