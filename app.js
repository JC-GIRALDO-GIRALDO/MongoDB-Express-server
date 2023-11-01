// app.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routers/auth-router");
const tasksRouter = require("./routers/tasks-router");
const authMiddleware = require("./middlewares/authMiddleware");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión a MongoDB exitosa");
  })
  .catch((err) => {
    console.error("Error de conexión a MongoDB:", err);
  });

// Rutas de autenticación
app.use("/auth", authRouter);

// Rutas de tareas protegidas por el middleware de autenticación
app.use("/tasks", authMiddleware, tasksRouter);

app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

// http://localhost:3000/tasks
