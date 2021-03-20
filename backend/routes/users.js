const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userJoi, avatarJoi } = require('../utils/utils');
const { getUsers, getUser, updateUser, updateAvatar } = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', celebrate(userJoi), updateUser);
usersRouter.patch('/me/avatar', celebrate(avatarJoi), updateAvatar);

module.exports = usersRouter
