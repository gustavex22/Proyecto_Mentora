const jwt = require("jsonwebtoken");

// Middleware para verificar JWT token
const verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No hay token proporcionado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu_secreto_super_seguro");
    req.usuarioId = decoded.id;
    next();
  } catch (error) {
    console.error("Error verificando token:", error.message);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = { verificarToken };
