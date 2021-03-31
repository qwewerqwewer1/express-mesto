const CardSchema = require('../models/card');

const getCards = (req, res) => {
  CardSchema.find({})
    .then((cardData) => res.send(cardData))
    .catch((err) => res.status(500).send(err.message));
};

const postCard = (req, res) => {
  const { name, link } = req.body;

  CardSchema.create({ name, link, owner: req.user._id })
    .then((dataCard) => res.send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getCardById = (req, res) => {
  CardSchema.findByIdAndDelete(req.params.cardId)
    .then((dataCard) => res.send({ data: dataCard }))
    .catch((error) => res.status(404).send(error.message));
};

const setLike = (req, res) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch(() => { res.status(404).send({ message: 'Нет карточки с таким id' }); });
};

const removeLike = (req, res) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch(() => { res.status(404).send({ message: 'Нет карточки с таким id' }); });
};

module.exports = {
  getCards, getCardById, postCard, setLike, removeLike,
};
