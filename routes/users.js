const router = require('express').Router();
const {
  // eslint-disable-next-line max-len
  validateGetUsers, validateGetProfile, validateGetUserById, validateUpdateInfoUser, validateUpdateAvatarUser,
} = require('../middlewares/validatons');

const {
  getUserById, getUsers, updateInfoUser, updateAvatarUser, getProfile,
} = require('../controllers/users');

router.get('/', validateGetUsers, getUsers);

router.get('/me', validateGetProfile, getProfile);

router.patch('/me', validateUpdateInfoUser, updateInfoUser);

router.patch('/me/avatar', validateUpdateAvatarUser, updateAvatarUser);

router.get('/:id', validateGetUserById, getUserById);

module.exports = router;
