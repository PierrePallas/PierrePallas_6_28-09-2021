// Importation de express pour fonction router
const express = require("express");

// Utilisation de la fonction Router d'express
const router = express.Router();

// Importation du controller sauce
const sauceController = require("../controllers/sauces");

// Importation du middleware Auth
const auth = require("../middleware/auth");
const { route } = require("./user");

// Importation du middleware multer
const multer = require("../middleware/multer-config");

// Importation de Joi (validation de données)
const dataValidator = require("../middleware/data-validator");

// Route Créer une sauce
router.post(
  "/",
  auth,
  multer,
  dataValidator.sauces,
  sauceController.createSauce
);

// Route Get
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);

// Route modifier une sauce
router.put(
  "/:id",
  auth,
  multer,
  dataValidator.sauces,
  sauceController.modifySauce
);

// Route supprimer une sauce
router.delete("/:id", auth, sauceController.deleteSauce);

// Route like une sauce
router.post("/:id/like", auth, sauceController.likeDislikeSauce);

module.exports = router;
