const { Joi } = require('celebrate');

const errorMessage = {
  400: 'Переданы некорректные данные',
  401: 'Необходима авторизация',
  403: 'Недостаточно прав',
  404: 'Запрашиваемые данные не найдены',
  409: 'Такой пользователь уже существует',
  500: 'Проблемы с сервером, но мы скоро все исправим',
};

const authJoi = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^\w{6,12}$/),
  }),
};

const userJoi = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(40),
    about: Joi.string().required().min(2).max(100),
  }),
};

const avatarJoi = {
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?.+#?$/),
  }),
};

const cardJoi = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(www\.)?.+#?$/),
  }),
};

const cardIdJoi = {
  params: Joi.object().keys({
    id: Joi.string().required().pattern(/^\w+$/),
  }),
};

module.exports = {
  errorMessage, authJoi, userJoi, avatarJoi, cardJoi, cardIdJoi,
};
