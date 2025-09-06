/*import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB  from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import vendorRoute from "./routes/vendorRoute.js"; 
import bannerRoute from "./routes/bannerRoute.js";
import heroRoute from "./routes/heroRoute.js";


// Função para conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
    try {
        // Estabelecendo conexão com o banco de dados
        await connectDB();
       // await sequelize.sync();

        // Conectando ao Cloudinary
        connectCloudinary();

        // Criando a aplicação
        const app = express();
        const port = process.env.PORT || 4000;

        // Middlewares
        app.use(express.json());
        app.use(cors());

        // Endpoints da API
        app.use('/api/user', userRoute);
        app.use('/api/product', productRouter);
        app.use('/api/vendor', vendorRoute);
        app.use('/api/banner', bannerRoute);
        app.use('/api/hero', heroRoute);
    

        app.get("/", (req, res) => {
            res.send("API funcionando");
        });

        // Iniciando o servidor
        app.listen(port,"0.0.0.0", () => {
            console.log(`Server is running on PORT ${port}`);
        });

    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
    }
};

// Iniciando o servidor
startServer();
*/
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

// Origens permitidas
const allowedOrigins = [
  "http://localhost:5173",       // frontend local (site)
  "http://localhost:5174",       // frontend local (admin)
  "https://dev-valderlan.com.br" // produção
];

// Função para conectar ao banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    await connectAndSyncDB(); // conecta banco
    connectCloudinary();      // conecta Cloudinary

    const app = express();
    const port = process.env.PORT || 4000;

    // ---------------------- MIDDLEWARES ---------------------- //
    app.use(express.json()); // JSON

    // CORS
    app.use(cors({
      origin: function(origin, callback) {
        if (!origin) return callback(null, true); // Postman, curl etc
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "token"], // inclui token
      credentials: true
    }));

    // Garante resposta para preflight
    app.options("*", cors());

    // ---------------------- ROTAS ---------------------- //
    app.use("/api/user", userRoute);
    app.use("/api/product", productRouter);
    app.use("/api/vendor", vendorRoute);
    app.use("/api/banner", bannerRoute);
    app.use("/api/hero", heroRoute);

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
