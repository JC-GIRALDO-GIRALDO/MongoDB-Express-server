const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// Ruta para registrar un nuevo usuario
// POST
// http://localhost:3000/auth/register
/*
{
  "username": "nuevo_usuario",
  "password": "contraseña_segura"
}
*/
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Solicitud POST con cuerpo vacío o atributos faltantes",
      });
    }

    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hash del password para almacenarlo de forma segura en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Guarda el usuario en la base de datos
    await newUser.save();

    // Crear y firmar el token JWT
    const token = jwt.sign(
      { username: newUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Puedes ajustar el tiempo de expiración del token
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error al registrar un usuario:", err);
    res.status(500).json({ error: "Error al registrar un usuario" });
  }
});

// Ruta para el inicio de sesión
// POST
// http://localhost:3000/auth/login
/*
{
  "username": "nombre_de_usuario",
  "password": "contraseña"
}
*/
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Solicitud POST con cuerpo vacío o atributos faltantes",
      });
    }

    // Verifica si el usuario existe en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Compara la contraseña ingresada con la almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Si las credenciales son válidas, crea un token JWT
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Puedes ajustar el tiempo de expiración del token
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
