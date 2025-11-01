import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || decoded.isAdmin !== true) {
      return res
        .status(401)
        .json({ success: false, message: "Token inválido ou sem permissão." });
    }

    const adminUser = await User.findOne({
      where: { id: decoded.id, isAdmin: true },
    });

    if (!adminUser) {
      return res
        .status(403)
        .json({ success: false, message: "Acesso negado. Não é administrador." });
    }

    req.user = adminUser;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ success: false, message: "Token inválido ou expirado." });
  }
};

export default adminAuth;
