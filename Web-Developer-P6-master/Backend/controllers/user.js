// Importation de Json Web Token
const jwt = require("jsonwebtoken");

// Importation de bcrypt
const bcrypt = require("bcrypt");

// Importation de crypto-js
const cryptojs = require("crypto-js");

// Importation variable environnement
const dotenv = require("dotenv");
const password = require("../middleware/password");
const result = dotenv.config();

// importation model de la base de données User.js
const User = require("../models/User");

// Enregistrer un nouvel utilisateur (signup)
const signup = async (req, res) => {
  // Chiffrer email avant envoi
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`)
    .toString();

  //   Hasher password avant envoi
  const hash = await bcrypt.hash(req.body.password, 10);
  //Enregistrement dans mongoDB
  const user = new User({
    email: emailCryptoJs,
    password: hash,
  });

  //Envoyer le user dans la base de donnée
  try {
    await user.save();
    req.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  // Chiffrer email avant envoi
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`)
    .toString();

  const query = User.find({
    email: emailCryptoJs,
  });

  const result = await query.exec();
  if (result.length === 1) {
    const user = result[0];
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      res.status(401).json({ message: "Mot de passe invalide" });
    }
    //Générer le token JWT
    const newToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h",
      }
    );
    // Mise en place du token en session cookie
    req.session.token = newToken;
    res.status(200).json({
      userId: user._id,
      token: newToken,
    });
  } else {
    res.status(400).json({ message: "Email non trouvé" });
  }
  res.status(500).json({ error });
};

module.exports = {
  signup,
  login,
};

// res.cookie('token', { expires: Date.now() })
//res.end('')