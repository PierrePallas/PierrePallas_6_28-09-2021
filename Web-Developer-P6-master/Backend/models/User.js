// Importer mongoose
const mongoose = require("mongoose");

// Importer mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");

// Modèle pour enregistrer un nouvel utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Sécurité supplémentaire pour ne pas enregistrer 2 fois la même adresse mail
userSchema.plugin(uniqueValidator);

// Exporter le module
module.exports = mongoose.model("user", userSchema);
