const router = require('express').Router();
const { createUser, getUserById, getUsers } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

module.exports = router;
