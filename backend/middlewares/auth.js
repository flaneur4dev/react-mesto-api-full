const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = function(req, res, next) {
  const token = (/(?<=apt=)[^;]+/.exec(req.headers.cookie) || [])[0];

  if (!token) throw new AuthenticationError();

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret')
  } catch(err) {
    throw new AuthenticationError()
  }  
  req.user = payload;

  next()
}
