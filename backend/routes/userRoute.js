/*import express from 'express';

import { loginUser, registerUser, adminLogin, changeAdminCredentials, registerAdmin } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRoute = express.Router();

userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)

// ROTAS DE ADMIN
userRoute.post('/admin',  adminLogin)

// Adicione a nova rota de cadastro de administrador
userRoute.post('/register-admin', registerAdmin)
userRoute.post('/change-credentials', adminAuth, changeAdminCredentials)

export default userRoute;*/


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

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/current", adminAuth, getCurrentUser);

// Rotas de administrador
userRoute.post("/admin", adminLogin);
userRoute.post("/register-admin", registerAdmin);
userRoute.post("/change-credentials", changeAdminCredentials);
userRoute.delete("/admin/users/:id", adminAuth, deleteUser);

// 🔐 Rotas para gerenciamento de usuários
userRoute.get("/admin/users",  getAllUsers);
userRoute.put("/admin/users/:id", updateUser);
userRoute.put("/admin/users/:id/password",  updateUserPassword);

export default userRoute;
