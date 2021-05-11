const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/un-auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnAuthError('Необходима авторизация');
  }
  // извлечь токен
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    // записать пайлоад в объект запроса
    req.user = payload;
    next();
  } catch (err) {
    throw new UnAuthError('Необходима авторизация');
  }
};
