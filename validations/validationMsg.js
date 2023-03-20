const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validationMsg = function(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 401));
  }

  next();
};

module.exports = validationMsg;
