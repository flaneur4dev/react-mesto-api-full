const Card = require('../models/card');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

function getCards(req, res, next) {
  Card.find({})
    .populate('user')
    .then(cards => res.status(200).send(cards))
    .catch(next)
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(201).send(card))
    .catch(next)
}

function deleteCard(req, res, next) {
  Card.findById(req.params.id)
    .then(card => {
      if (!card) throw new NotFoundError();
      if (card.owner != req.user._id) throw new AuthorizationError();

      return Card.findByIdAndDelete(req.params.id)
    })
    .then(() => res.status(200).send({ message: `Карточка с id: ${req.params.id} удалена` }))
    .catch(next)
}

function addLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => {
      if (!card) throw new NotFoundError();
      res.status(200).send(card)
    })
    .catch(next)
}

function deleteLike(req, res, next) {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => {
      if (!card) throw new NotFoundError();
      res.status(200).send(card)      
    })
    .catch(next)
}

module.exports = { getCards, createCard, deleteCard, addLike, deleteLike }
