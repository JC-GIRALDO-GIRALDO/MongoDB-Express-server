const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Array de usuarios predefinidos
const users = [
  { username: "usuario1", password: "contraseña1" },
  { username: "usuario2", password: "contraseña2" },
];
// Content-Type  = key
// application/json  = value
//http://localhost:3000/auth/login
/*
{
  "username": "usuario1",
  "password": "contraseña1"
}
 */
// Middleware de autenticación
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales del usuario
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Crear y firmar el token JWT
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Middleware de protección con JWT
router.use((req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autorización no proporcionado" });
  }

  // Verificar y decodificar el token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token de autorización no válido" });
    }
    req.user = decoded; // Almacena el usuario decodificado en el objeto de solicitud
    next();
  });
});

module.exports = router;
