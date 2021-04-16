const router = require('express').Router();
const {
  getUserById, getUsers, updateInfoUser, updateAvatarUser, getProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getProfile);

router.get('/:id', getUserById);

router.patch('/me', updateInfoUser);

router.patch('/me/avatar', updateAvatarUser);

module.exports = router;
