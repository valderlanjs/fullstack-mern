import express from "express";
import cors from "cors";
import 'dotenv/config';
import{ connectDB,  sequelize } from "./config/mysql.js";
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
        await sequelize.sync();

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
        app.listen(port, () => {
            console.log(`Server is running on PORT ${port}`);
        });

    } catch (error) {
        console.error("Erro ao iniciar o servidor:", error);
    }
};

// Iniciando o servidor
startServer();
