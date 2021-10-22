const Joi = require("joi");

// Validation des données entrées ajout ou modification de la sauce
const saucesSchema = Joi.object({
  userId: Joi.string().trim().length(24).required(),
  name: Joi.string().trim().min(1).required(),
  manufacturer: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  mainPepper: Joi.string().trim().min(1).required(),
  heat: Joi.number().integer().min(1).max(10).required(),
});
exports.sauces = (req, res, next) => {
  let sauce;
  if (req.file) {
    sauce = JSON.parse(req.body.sauce);
  } else {
    sauce = req.body;
  }

  const { error, value } = saucesSchema.validate(sauce);
  if (error) {
    res.status(422).json({ error: "Données invalides" });
  } else {
    next();
  }
};



