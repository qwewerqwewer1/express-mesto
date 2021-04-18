const router = require('express').Router();
const {
  validateGetCards,
  validateGetCardById,
  validatePostCard,
  validateSetLike,
  validateRemoveLike,
} = require('../middlewares/validatons');

const {
  getCards, getCardById, postCard, setLike, removeLike,
} = require('../controllers/cards');

router.get('/', validateGetCards, getCards);

router.delete('/:cardId', validateGetCardById, getCardById);

router.post('/', validatePostCard, postCard);

router.put('/:cardId/likes', validateSetLike, setLike);

router.delete('/:cardId/likes', validateRemoveLike, removeLike);

module.exports = router;
