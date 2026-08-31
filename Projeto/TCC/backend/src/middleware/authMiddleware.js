import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.token;

  // ✅ Obter o token do cookie httpOnly OU do header Authorization
  let token = cookieToken;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // ✅ Validar se token existe
  if (!token) {
    return res.status(401).json({
      message: "Token não informado.",
      code: "NO_TOKEN",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ["HS256"] }
    );

    // ✅ Apenas propagar campos conhecidos do payload
    req.user = { id: decoded.id, role: decoded.role };

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
