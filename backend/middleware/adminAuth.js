import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;

        if (!token) {
            return res.json({success: false, message: "Login não autorizado, Tente novamente"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica se o token contém a informação do administrador
        if (!decodedToken.id || !decodedToken.isAdmin) {
            return res.json({success: false, message: "Login não autorizado, Tente novamente"});
        }

        // Verifica se o usuário ainda é administrador no banco de dados
        const adminUser = await User.findOne({where: {id: decodedToken.id, isAdmin: true}})

        if (!adminUser) {
            return res.json({success: false, message: "Usuário não autorizado ou não encontrado!"});
        }

        req.user = adminUser;
        next();
    } catch (error) {
        console.log(error)
         res.json({success: false, message: error.message})
    }
}


export default adminAuth;