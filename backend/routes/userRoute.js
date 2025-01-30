import express from 'express';

import { loginUser, registerUser, adminLogin, changeAdminCredentials } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRoute = express.Router();

userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)
userRoute.post('/admin',  adminLogin)
userRoute.post('/change-credentials', adminAuth, changeAdminCredentials)

export default userRoute;