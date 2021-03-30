const router = require('express').Router();
const createUser = require('../controllers/users');

router.post('/user', createUser); // mancraft   p.s. the game))

module.exports = { router };
