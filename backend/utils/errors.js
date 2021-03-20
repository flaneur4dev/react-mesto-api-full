const { errorMessage } = require('../utils/utils');

class InputDataError extends Error {
  constructor(message = errorMessage['400']) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message = errorMessage['401']) {
    super(message);
    this.statusCode = 401;
  }
}

class AuthorizationError extends Error {
  constructor(message = errorMessage['403']) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = errorMessage['404']) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = { InputDataError, AuthenticationError, AuthorizationError, NotFoundError }
