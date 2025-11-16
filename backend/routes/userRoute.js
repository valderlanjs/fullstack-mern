// routes/userRoute.js
import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  changeAdminCredentials,
  registerAdmin,
  getAllUsers,
  updateUser,
  updateUserPassword,
  getCurrentUser,
  deleteUser
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";
import { authenticate } from "../middleware/authenticate.js"; // ← CRIE ESTE MIDDLEWARE

const userRoute = express.Router();

// 🌐 Rotas públicas
userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);

// 🔐 Rota para usuário atual - QUALQUER usuário autenticado
userRoute.get("/current", authenticate, getCurrentUser); // ← MUDOU PARA authenticate

// 👑 Rotas de administrador
userRoute.post("/admin", adminLogin);

// 🔐 Rotas para gerenciamento de usuários (APENAS ADMIN)
userRoute.post("/register-admin", adminAuth, registerAdmin);
userRoute.post("/change-credentials", adminAuth, changeAdminCredentials);
userRoute.delete("/admin/users/:id", adminAuth, deleteUser);
userRoute.get("/admin/users", adminAuth, getAllUsers);
userRoute.put("/admin/users/:id", adminAuth, updateUser);
userRoute.put("/admin/users/:id/password", adminAuth, updateUserPassword);

export default userRoute;