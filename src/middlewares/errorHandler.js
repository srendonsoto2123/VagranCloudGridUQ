const AppError = require('../utils/appError');

const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: 'failed',
    message: err.message,
  });
};

module.exports = errorHandler;
