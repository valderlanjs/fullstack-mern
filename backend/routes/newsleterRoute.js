// routes/NewsletterRoute.js
import express from "express";
import {
  subscribeNewsletter,
  getSubscribers,
  unsubscribe
} from "../controllers/newsleterController.js";


const newsletterRoute = express.Router();

// Rota pública para inscrição
newsletterRoute.post("/subscribe", subscribeNewsletter);

// Rotas administrativas
newsletterRoute.get("/subscribers",  getSubscribers);
newsletterRoute.put("/unsubscribe/:id", unsubscribe);

export default newsletterRoute;