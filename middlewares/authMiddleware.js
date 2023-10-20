// authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findOne({ username: decoded.username }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Token no válido." });
      }
      req.user = user;
      next();
    });
  } catch (ex) {
    res.status(401).json({ error: "Token no válido." });
  }
};
