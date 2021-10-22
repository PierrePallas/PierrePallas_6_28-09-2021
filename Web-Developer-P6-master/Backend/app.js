// Importation de express
const express = require("express");

// Importation de mongoose
const mongoose = require("mongoose");

// Importration de path pour avoir accès aux chemins du système de fichiers
const path = require("path");

// Importation de cors
const cors = require("cors");

// Importation de dotenv
const dotenv = require("dotenv");
const result = dotenv.config();

// Importation de helmet (sécurité des headers)
const helmet = require("helmet");

const session = require("express-session");

// Importation des routes
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

// Créer application express
const app = express();

// Importation de body-parser
const bodyParser = require("body-parser");

app.use(cors());

// Connexion à la base de données MongoDb
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Gérer erreur CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Transformer le corps de la requete en json
app.use(bodyParser.json());

// Sécurisation des headers
app.use(helmet());

// Stockage du jwt côté front
app.use(session({ secret: "COOKIE_KEY", cookie: { maxAge: 900000 } }));

// Envoyer image sauce dans le dossier image
app.use("/images", express.static(path.join(__dirname, "images")));

// Création de la route d'authentification
app.use("/api/auth", userRoutes);

app.use("/api/sauces", saucesRoutes);

// Exporter app.js pour accès depuis autre fichier
module.exports = app;
