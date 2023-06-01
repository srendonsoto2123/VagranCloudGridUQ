const mongoose = require('mongoose');

const boxSchema = mongoose.Schema({
  name: {
    unique: [true, 'Este dato debe ser unico para las cajas'],
    type: String,
    required: [true, 'Este dato es importante para crear una Caja.'],
  },
  description: {
    type: String,
    required: [true, 'Las Cajas necesitan una descripción.'],
  },
  shortDescription: {
    type: String,
    maxLenght: [50, 'La descripción corta no puede tener más de 50 caracteres.'],
  },
}, {
  toJSON: { virtuals: true },
  id: false,
});

boxSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

boxSchema.virtual('versions', {
  ref: 'Version',
  foreignField: 'box',
  localField: '_id',
});

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;
