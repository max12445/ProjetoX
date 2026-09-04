export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Autenticação necessária." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Você não possui permissão para realizar esta ação.",
      });
    }

    next();
  };
};