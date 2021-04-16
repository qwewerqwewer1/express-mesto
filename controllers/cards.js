const CardSchema = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => {
  CardSchema.find({})
    .then((cardData) => res.send(cardData))
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;

  CardSchema.create({ name, link, owner: req.user._id })
    .then((dataCard) => res.send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};

const getCardById = (req, res, next) => {
  CardSchema.findByIdAndDelete(req.params.cardId)
    .then((dataCard) => {
      if (!dataCard) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (dataCard.owner._id.toString() === req.user._id) {
        res.status(200).send({ message: 'Карточка удалена!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((dataLike) => {
      if (!dataLike) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else {
        res.status(200).send({ data: dataLike });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};
const removeLike = (req, res, next) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((dataLike) => {
      if (!dataLike) {
        throw (new BadRequestError('Данные некорректны!'));
      } else {
        res.status(200).send({ data: dataLike });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, getCardById, postCard, setLike, removeLike,
};
