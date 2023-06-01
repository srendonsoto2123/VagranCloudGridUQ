const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileupload = require('express-fileupload');
const passport = require('passport');

const startMongoDB = require('./connectMongoDB');
const AppError = require('./utils/appError');
const { createMetadataGrid } = require('./middlewares/gridMetadata');
const errorHandler = require('./middlewares/errorHandler');

const BASE_URL = '/api/v1';

// Import Routes
const boxRouter = require('./routes/box.routes');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');

// Starting the app.
const app = express();

// Middlewares
app.use(fileupload({
  useTempFiles: true,
  tempFilesDir: '/tmp/',
  createParentPath: true,
  preserveExtension: true,
  uploadTime: 0,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Permitir acceder a los archivos estáticos en el servidor (Las Cajas)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(createMetadataGrid);
// AUTENTICACIÓN
app.use(passport.initialize());

// Endpoints
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/auth`, authRouter);
app.use(`${BASE_URL}/boxes`, boxRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`No puedo encontrar la ruta ${req.originalUrl} en este servidor`, 404));
});

app.use(errorHandler);

startMongoDB();

module.exports = app;
