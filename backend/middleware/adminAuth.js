import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(401).json({success: false, message: "Não autorizado. Token não fornecido."});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken.id || !decodedToken.isAdmin) {
            return res.status(401).json({success: false, message: "Não autorizado. Token inválido."});
        }

        const adminUser = await User.findOne({ 
            where: { 
                id: decodedToken.id, 
                isAdmin: true 
            }
        });

        if (!adminUser) {
            return res.status(403).json({success: false, message: "Acesso negado. O usuário não é um administrador."});
        }

        // Anexa o usuário à requisição para uso posterior nas rotas
        req.user = adminUser;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, message: "Token inválido ou expirado."})
    }
}

export default adminAuth;