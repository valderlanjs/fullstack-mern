import jwt from "jsonwebtoken";

// Middleware para verificar e renovar token se necessário
const checkSessionTimeout = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verifica se o token está perto de expirar (últimos 5 minutos)
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Se o token expirar em menos de 5 minutos, renova
    if (timeUntilExpiry < 300) { // 5 minutos em segundos
      const newToken = jwt.sign(
        { 
          id: decoded.id, 
          isAdmin: decoded.isAdmin 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );
      
      // Adiciona o novo token no header da resposta
      res.set('New-Token', newToken);
    }
    
    next();
  } catch (error) {
    // Se houver erro na verificação, continua sem renovar
    next();
  }
};

export { checkSessionTimeout };