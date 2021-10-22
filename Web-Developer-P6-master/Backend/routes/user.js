// Importation de express pour fonction router
const express = require("express");

// Importation du middleware password
const password = require("../middleware/password");

// Importation controllers user
const userController = require("../controllers/user");

// Utilisation de la fonction Router d'express
const router = express.Router();

// Route SignUp
router.post("/signup", password, userController.signup);

// Route Login
router.post("/login", userController.login);

// Exporter le module
module.exports = router;
