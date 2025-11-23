import jwt from "jsonwebtoken";

export const checkSessionTimeout = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const timeLeft = decoded.exp * 1000 - Date.now();

    // Renova se faltar menos de 5 minutos
    if (timeLeft < 5 * 60 * 1000) {
      const newToken = jwt.sign(
        {
          id: decoded.id,
          isAdmin: decoded.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.setHeader("new-token", newToken);
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      code: "TOKEN_EXPIRED",
      message: "Sessão expirada",
    });
  }
};
