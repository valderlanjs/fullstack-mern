import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Token inválido." });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Usuário não encontrado." });
    }

    req.user = user;
    
    // Adiciona informações do token para controle de tempo
    req.tokenExpiry = decoded.exp;
    
    next();
  } catch (error) {
    console.error("Erro de autenticação:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ 
          success: false, 
          message: "Sessão expirada. Faça login novamente.",
          code: "TOKEN_EXPIRED"
        });
    }
    
    return res
      .status(401)
      .json({ 
        success: false, 
        message: "Token inválido.",
        code: "INVALID_TOKEN"
      });
  }
};

export { authenticate };