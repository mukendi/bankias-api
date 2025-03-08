const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware d’authentification
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Accès refusé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// Middleware pour vérifier si l'utilisateur est ADMIN
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Accès interdit" });
  next();
};

module.exports = { authenticate, isAdmin };
