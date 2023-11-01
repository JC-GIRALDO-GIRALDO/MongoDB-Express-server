const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: String,
  isCompleted: Boolean,
  name: String,
  description: String,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
