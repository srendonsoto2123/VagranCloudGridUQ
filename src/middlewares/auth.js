const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
  jwtSecret,
  jwtExpiresIn,
} = require('../settings');

const signToken = (id) => jwt.sign({ id }, jwtSecret, {
  expiresIn: jwtExpiresIn,
});

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const u = user;
  u.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: u,
    },
  });
};

const signUp = catchAsync(async (req, res) => {
  const {
    name, email, password, passwordConfirm,
  } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('No ha ingresado el email o la contraseña', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  createSendToken(user, 200, req, res);
});

// Funcion usada para realizar la protección de las rutas y exigir conexión
// mediante el uso de un jsonwebtoken
const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization
    || !authorization.startsWith('Bearer')
  ) {
    throw new AppError('El usuario no está conectado');
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    throw new AppError('El usuario no está ha conectado');
  }

  const decode = await promisify(jwt.verify)(token, jwtSecret);

  const currentUser = await User.findById(decode.id);

  // Valida la existencia de un usuario dentro de la plataforma.
  if (!currentUser) {
    throw new AppError(
      'El usuario no existe en la plataforma',
      401,
    );
  }

  // Valida que la contraseña no haya sido cambiada después de creado el token
  if (currentUser.changedPasswordAfter(decode.iat)) {
    throw new AppError(
      'La contraseña fue cambiada recientemente por favor conectarse nuevamente',
      401,
    );
  }

  req.gridMetadata.currentUser = currentUser;
  res.locals.user = currentUser;
  next();
});

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.gridMetadata.currentUser.role)) {
    throw new AppError(
      'Tú no tienes permiso para realizar esta acción',
      403,
    );
  }

  next();
};

module.exports = {
  signUp,
  signIn,
  protect,
  restrictTo,
};
