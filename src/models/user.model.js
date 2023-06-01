const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de los usuarios es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio para registrarse en la plataforma.  '],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingrese un correo valido'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'student', 'teacher', 'seminario'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria para realizar el registro'],
    minLength: 10,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Es necesario validar la contraseña usada'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Las contraseñas no coinciden',
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  return next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  return next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return changedTimeStamp < JWTTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const MILISECONDS_IN_A_SECOND = 1000;
  const SECONDS_IN_A_MINUTE = 60;
  const DURATION_IN_MINUTES = 10;

  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digist('hex');

  this.passwordResetExpires = Date.now() + DURATION_IN_MINUTES
    * SECONDS_IN_A_MINUTE * MILISECONDS_IN_A_SECOND;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
