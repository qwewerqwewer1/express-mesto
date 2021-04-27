const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/),
  }),
});

const validateGetUsers = celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateGetProfile = celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateUpdateInfoUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateUpdateAvatarUser = celebrate({
  body: Joi.object().keys({
    link: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле "avatar" должно быть валидным url-адресом');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateGetCards = celebrate({
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validatePostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value, { require_protocol: true })) {
        return value;
      }
      return helpers.message('Поле "link" должно быть валидным url-адресом');
    }),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateGetCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateSetLike = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

const validateRemoveLike = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    'content-type': Joi.string().valid('application/json').required(),
    authorization: Joi.string().max(200).required(),
  }).unknown(),
});

module.exports = {
  // VALIDATE SIGN
  validateSignIn,
  validateSignUp,
  // VALIDATE USERS
  validateGetUsers,
  validateGetProfile,
  validateGetUserById,
  validateUpdateInfoUser,
  validateUpdateAvatarUser,
  // VALIDATE CARDS
  validateGetCards,
  validatePostCard,
  validateGetCardById,
  validateSetLike,
  validateRemoveLike,
  // p.s. kill me pls!!!!
};
