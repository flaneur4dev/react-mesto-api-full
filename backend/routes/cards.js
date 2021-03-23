const cardsRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { cardJoi, cardIdJoi } = require('../utils/utils');
const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(cardJoi), createCard);
cardsRouter.delete('/:id', celebrate(cardIdJoi), deleteCard);
cardsRouter.put('/:id/likes', celebrate(cardIdJoi), addLike);
cardsRouter.delete('/:id/likes', celebrate(cardIdJoi), deleteLike);

module.exports = cardsRouter;
