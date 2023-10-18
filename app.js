const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("./db");
const authRouter = require("./routers/auth-router");
const tasksRouter = require("./routers/tasks-router");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(cors()); //pendiente
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

const tasksFilePath = path.join(__dirname, "tasks.json");

// Middleware para validar métodos HTTP válidos
app.use((req, res, next) => {
  if (
    req.method !== "GET" &&
    req.method !== "POST" &&
    req.method !== "PUT" &&
    req.method !== "DELETE"
  ) {
    return res.status(400).json({ error: "Método HTTP no válido" });
  }
  next();
});

app.get("/tasks", (req, res) => {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (err) {
    console.error("Error al leer el archivo JSON:", err);
    res.status(500).json({ error: "Error al leer el archivo JSON" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

// http://localhost:3000/tasks
