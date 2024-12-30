import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRoute from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

// app config

const app = express();
const port = process.env.PORT || 4000;


connectDB()
connectCloudinary()

//Middlewar  
app.use(express.json());
app.use(cors());

//api endpoints
app.use('/api/user', userRoute);
app.use('/api/product', productRouter);


app.get("/", (req, res) => {
    res.send("API trabalhando");
})

app.listen(port, () => console.log(`Server is running on PORT ${port}`))