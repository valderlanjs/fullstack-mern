import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('URI lida do .env:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Conectado ao MongoDB");
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB:", error.message);
        throw error;
    }
};

export default connectDB;




/*import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB Conectado')
    })

    await mongoose.connect(`${process.env.MONGO_URI}`);
}

export default connectDB;*/