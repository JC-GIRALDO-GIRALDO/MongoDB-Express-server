// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // Agrega un campo para el nombre de la colección asociada al usuario
  collectionName: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
