const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 30,
    minLenght: 2,
    required: [true, 'Название карточки'],
  },
  link: {
    type: String,
    required: [true, 'Ссылка на карточку'],
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true })
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
