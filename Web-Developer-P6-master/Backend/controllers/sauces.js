const { json } = require("body-parser");
const { parse } = require("dotenv");
const Sauce = require("../models/sauces");
const fs = require("fs");
const sauces = require("../models/sauces");

// Création d'une nouvelle sauce par un utilisateur
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    userLikes: [' '],
    userDislikes: [' '],
  });
  sauce
    // Enregistrement de la nouvelle sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Nouvelle sauce sauvegardée !",
      });
    }) //Sinon
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Récupération d'une Sauce par son Id
exports.getOneSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    // si modification de l'image, supression de l'ancienne
    Sauce.findOne({_id: req.params.id})
    .then(sauces => {
      const filename = sauces.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
      // image supprimée donc mise à jour des modifications
      const sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get(`host`)}/images/${req.file.filename}`
      }
      Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
  } else {
    // Si l'image n'a pas été modifiée
    const sauceObject = { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch(error => res.status(400).json({ error }));
  }
};

// Supprimer une sauce
exports.deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id, userId: req.userId });
    const filename = sauce.imageUrl.split('/images/')[1];
  }
  catch (err) {
    res.status(403).json({ error: err });
    return;
  }

  try {
    await fs.promises.unlink(`images/${filename}`);
  }
  catch (err) {
    console.error(err);
  }

  try {
    await Sauce.deleteOne({ _id: req.params.id });
  }
  catch (err) {
    res.status(500).json({ error: err });
    return
  }

  res.status(200).json({ message: "Sauce supprimée!" })
}



// Récupérer toutes les sauces
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

// Like et Dislike d'une sauce
exports.likeDislikeSauce = (req, res, next) => {
  const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // nouvelles valeurs à modifier
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // Sauce likée
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // Sauce dislikée
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // Annuler like et dislike
                    if (newValues.usersLiked.includes(userId)) {
                        //  annule le like
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        //  annule le dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;
            // Mise à jour de la sauce avec les nouveaux likes et dislikes
            Sauce.updateOne({ _id: sauceId }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }));
  }