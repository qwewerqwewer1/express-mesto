const CardSchema = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getCards = (req, res, next) => {
  CardSchema.find({})
    .then((cardData) => res.send(cardData))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
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

module.exports.getCardById = (req, res, next) => {
  // Я не знаю почему, но метод findByIdAndDelete при удалении чужой карты
  // сначала писал who are you human?, а потом если просто еще разок попробывал
  // удалить чужую карту, то удалял! Такая штука только при 2-х нажатиях пордяд на DELETE
  CardSchema.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((dataCard) => {
      if (dataCard.owner._id.toString() === req.user._id) {
        dataCard.delete();
        res.status(200).send({ message: 'Карточка удалена!' });
      } else {
        res.status(418).send({ message: 'who are you human?' });
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

module.exports.setLike = (req, res, next) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена.'))
    .then((dataLike) => res.status(200).send({ data: dataLike }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};
module.exports.removeLike = (req, res, next) => {
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new BadRequestError('Данные некорректны!'))
    .then((dataLike) => res.status(200).send({ data: dataLike }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные некорректны!'));
      } else {
        next(err);
      }
    });
};
