const router = require('express').Router();
const {
  createUser, getUserById, getUsers, updateInfoUser, updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/me', updateInfoUser);

router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
