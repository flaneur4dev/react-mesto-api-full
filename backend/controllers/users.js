const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

function createUser(req, res, next) {
  const { email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash }))
    .then(() => res.status(201).send({ message: 'Вы успешно зарегистрировались!' }))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      const {
        name, about, avatar, email, _id,
      } = user;

      res
        .status(200)
        .cookie('apt', token, {
          maxAge: 86.4e6, secure: true, sameSite: true, httpOnly: true,
        })
        .send({
          name, about, avatar, email, _id,
        });
    })
    .catch(next);
}

function logout(req, res) {
  res
    .status(200)
    .cookie('apt', '', { maxAge: 0, httpOnly: true })
    .send({ message: 'Пользователь вышел' });
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError();
      res.status(200).send(user);
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
}

module.exports = {
  createUser, login, logout, getUsers, getUser, updateUser, updateAvatar,
};
