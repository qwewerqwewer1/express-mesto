const userRouter = require('express').Router;
const { createUser } = require('../controllers/users');

userRouter.post('/user', createUser); // mancraft   p.s. the game))

module.exports = userRouter;
