const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

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
// Inicio de sesión de un usuario
// POST
// http://localhost:3000/auth/login
/*
{
  "username": "nuevo_usuario",
  "password": "contraseña_segura"
}
*/

// Acceso a otras rutas protegidas con JWT
// Authorization: Bearer <token>

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
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (err) {
    console.error("Error al registrar un usuario:", err);
    res.status(500).json({ error: "Error al registrar un usuario" });
  }
});

// Resto de las rutas, incluyendo protección con JWT, aquí...

module.exports = router;
