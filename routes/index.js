const AppError = require('../utils/appError');

module.exports = app => {
  app.use('/api', [require('./authRoutes'), require('./userRoutes')]);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
};
