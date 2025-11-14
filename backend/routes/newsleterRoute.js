// routes/NewsletterRoute.js
import express from "express";
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribe
} from "../controllers/newsleterController.js";
import adminAuth from "../middleware/adminAuth.js";

const newsletterRoute = express.Router();

// Rota pública para inscrição
newsletterRoute.post("/subscribe", subscribeNewsletter);

// Rotas administrativas
newsletterRoute.get("/subscribers", adminAuth, getSubscribers);
newsletterRoute.put("/unsubscribe/:id", adminAuth, unsubscribe);

export default newsletterRoute;