import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import adminAuth from "../middleware/adminAuth.js";

const dashboardRoute = express.Router();

dashboardRoute.get("/stats", adminAuth, getDashboardStats);

export default dashboardRoute;