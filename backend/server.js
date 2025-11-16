import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectAndSyncDB } from "./config/postgres.js";
import connectCloudinary from "./config/cloudinary.js";

import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import vendorRoute from "./routes/vendorRoute.js";
import bannerRoute from "./routes/bannerRoute.js";
import heroRoute from "./routes/heroRoute.js";
import cardRoute from "./routes/CardRoute.js";
import logoRoute from "./routes/logoRoute.js";
import footerRoute from "./routes/footerRoute.js";
import homeSectionRoute from "./routes/homeSectionRoute.js";
import featuresRoute from "./routes/featureRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import sectionRoute from "./routes/sectionRoute.js";
import aboutSectionRoute from "./routes/aboutRoute.js";
import servicesSectionRoute from "./routes/serviceSectionRoute.js";
import AboutBannerRouter from "./routes/AboutBannerRoute.js";
import certificationRouter from "./routes/certificationSectionRoute.js";
import newsletterRoute from "./routes/newsleterRoute.js";
import faqRoutes from "./routes/faqRoute.js";
import pageRoutes from "./routes/pageRoute.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://dev-valderlan.com.br",
  "http://dev-valderlan.com.br",
  "http://www.dev-valderlan.com.br",
  "https://www.dev-valderlan.com.br",
];

// Função para conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    await connectAndSyncDB(); // conecta banco
    connectCloudinary(); // conecta Cloudinary

    const app = express();
    const port = process.env.PORT || 4000;

    // ---------------------- MIDDLEWARES ---------------------- //
    app.use(express.json()); // JSON

    // CORS
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.warn("🚫 Origin bloqueada pelo CORS:", origin);
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "token"],
        credentials: true,
      })
    );

    // Garante resposta para preflight
    app.options("*", cors());

    // ---------------------- ROTAS ---------------------- //
    app.use("/api/user", userRoute);
    app.use("/api/product", productRouter);
    app.use("/api/vendor", vendorRoute);
    app.use("/api/banner", bannerRoute);
    app.use("/api/hero", heroRoute);
    app.use("/api/cards", cardRoute);
    app.use("/api/logo", logoRoute);
    app.use("/api/footer", footerRoute);
    app.use("/api/home-section", homeSectionRoute);
    app.use("/api/features", featuresRoute);
    app.use("/api/dashboard", dashboardRoute);
    app.use("/api/sections", sectionRoute);
    app.use("/api/about-section", aboutSectionRoute);
    app.use("/api/services-section", servicesSectionRoute);
    app.use("/api/about-banner", AboutBannerRouter);
    app.use("/api/certification-section", certificationRouter);
    app.use("/api/newsletter", newsletterRoute);
    app.use("/api/faqs", faqRoutes);
    app.use("/api/pages", pageRoutes);

    app.get("/", (req, res) => {
      res.send("API funcionando com MySQL e Sequelize!");
    });

    // ---------------------- START SERVER ---------------------- //
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error("❌ Erro fatal ao iniciar o servidor:", error);
  }
};

// Iniciando o servidor
startServer();
