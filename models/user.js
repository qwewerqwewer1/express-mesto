const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ваше имя'],
    minLength: [2, 'Имя не может состоять только из одной буквы'],
    maxLength: [30, 'Данные строки не могут превышать более 30 символов'],
    validate: {
      validator: (v) => /[А-ЯЁ][а-яё]+/.test(v), // Спасибо вебинару Артема Евсякова
      message: 'Имя доллжно быть на русском языке и начинаться с Большой буквы',
    },
  },
  about: {
    type: String,
    required: [true, 'Ваш род деятельности'],
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Обязательно укажите ссылку на вашу аватарку'],
  },
});

module.exports = mongoose.model('user', userSchema);
