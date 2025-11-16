import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";


const dashboardRoute = express.Router();

dashboardRoute.get("/stats",  getDashboardStats);

export default dashboardRoute;