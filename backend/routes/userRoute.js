import express from 'express';

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

export default userRoute;