import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Validar se header existe
  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado.",
    });
  }

  // ✅ Validar que começa com "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Formato inválido. Use: Authorization: Bearer <token>",
    });
  }

  const token = authHeader.split(" ")[1];

  // ✅ Validar se token não é vazio
  if (!token) {
    return res.status(401).json({
      message: "Token vazio.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    // ✅ Diferenciar tipos de erro
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expirado.",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido.",
        code: "INVALID_TOKEN"
      });
    }

    return res.status(401).json({
      message: "Erro ao validar token.",
    });
  }
};
