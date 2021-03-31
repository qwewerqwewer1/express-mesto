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
    .then((dataCard) => {
      if (!dataCard) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(200).send({ data: dataCard });
      }
    })
    .catch((error) => res.status(500).send(error.message));
};

const setLike = (req, res) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((dataLike) => {
      if (!dataLike) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(200).send({ data: dataLike });
      }
    })
    .catch((err) => { res.status(500).send({ message: err.message }); });
};

const removeLike = (req, res) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((dataLike) => {
      if (!dataLike) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res.status(200).send({ data: dataLike });
      }
    })
    .catch((err) => { res.status(500).send({ message: err.message }); });
};

module.exports = {
  getCards, getCardById, postCard, setLike, removeLike,
};
