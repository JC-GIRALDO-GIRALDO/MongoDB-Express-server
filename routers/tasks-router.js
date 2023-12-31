const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middlewares/authMiddleware");

// Aplica el middleware de autenticación a todas las rutas de tareas que requieran autenticación
router.use(authMiddleware);

// Ruta para crear una tarea con nombre y descripción
// http://localhost:3000/tasks/create
/*
{
  "name": "Tarea",
  "description": "description de la tarea"
}
*/
router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        error: "Solicitud POST con cuerpo vacío o atributos faltantes",
      });
    }

    // Crea una nueva tarea
    const newTask = new Task({
      isCompleted: false,
      name,
      description,
    });

    // Guarda la tarea en la base de datos
    const savedTask = await newTask.save();

    res.status(200).json(savedTask);
  } catch (err) {
    console.error("Error al crear una tarea:", err);
    res.status(500).json({ error: "Error al crear una tarea" });
  }
});

// Ruta para eliminar una tarea
// http://localhost:3000/tasks/delete/id-de-la-tarea
router.delete("/delete/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndRemove(taskId);

    if (deletedTask) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (err) {
    console.error("Error al eliminar la tarea:", err);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
});

// Ruta para actualizar una tarea (marcar como completada o editar descripción)
// http://localhost:3000/tasks/update/id-de-la-tarea

/*
{
  "isCompleted": false,
  "name": "Tarea",
  "description": "description de la tarea"
}
*/
router.put("/update/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    if (!req.body || (!req.body.name && !req.body.description)) {
      return res.status(400).json({
        error: "Solicitud PUT con cuerpo vacío o atributos faltantes",
      });
    }

    if (req.body.description) {
      task.description = req.body.description;
    }

    if (req.body.isCompleted !== undefined) {
      task.isCompleted = req.body.isCompleted;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error al actualizar la tarea:", err);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

// Ruta para listar tareas completas
router.get("/completed", async (req, res) => {
  try {
    const completedTasks = await Task.find({ isCompleted: true });
    res.json(completedTasks);
  } catch (err) {
    console.error("Error al listar tareas completas:", err);
    res.status(500).json({ error: "Error al listar tareas completas" });
  }
});

// Ruta para listar tareas incompletas
router.get("/incomplete", async (req, res) => {
  try {
    const incompleteTasks = await Task.find({ isCompleted: false });
    res.json(incompleteTasks);
  } catch (err) {
    console.error("Error al listar tareas incompletas:", err);
    res.status(500).json({ error: "Error al listar tareas incompletas" });
  }
});

// Ruta para obtener tareas asociadas al usuario actual
router.get("/tasks", async (req, res) => {
  const user = req.user; // Supongamos que tienes un middleware que verifica el token y guarda el usuario en req.user
  const taskIds = user.taskIds;

  try {
    const tasks = await Task.find({ _id: { $in: taskIds } });
    res.json(tasks);
  } catch (err) {
    console.error("Error al obtener las tareas del usuario:", err);
    res.status(500).json({ error: "Error al obtener las tareas del usuario" });
  }
});

module.exports = router;

