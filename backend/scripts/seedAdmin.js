// seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Mantenha esta linha
import dotenv from "dotenv";
import User from "../models/userModel.js";
import connectDB from "../config/mongodb.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const email = "admin15@gmail.com";
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("❌ Usuário admin já existe");
    process.exit();
  }

  // Volte a fazer o hash da senha!
  const hashedPassword = await bcrypt.hash("12345678", 10); // Hash da senha

  const admin = new User({
    name: "Administrador",
    email,
    password: hashedPassword, // Armazene o hash
    isAdmin: true,
  });

  await admin.save();
  console.log("✅ Usuário admin criado com sucesso");
  process.exit();
};

seedAdmin();