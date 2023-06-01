const mongoose = require('mongoose');
const validator = require('validator');

const userProviderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Es necesario el nombre del usuario'],
  },
  email: {
    type: String,
    required: [true, 'Es necesario el correo del usuario'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'student', 'teacher', 'seminario'],
    default: 'user',
  },
  foto: {
    type: String,
  },
});

const User = mongoose.model('UserProvider', userProviderSchema);

module.exports = User;
