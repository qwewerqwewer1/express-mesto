const router = require('express').Router();
const {
  getCards, getCardById, postCard, setLike, removeLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', getCardById);

router.post('/', postCard);

router.put('/:cartId/likes', setLike);

router.delete('/:cardId/likes', removeLike);

module.exports = router;
