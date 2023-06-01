const mongoose = require('mongoose');

const versionSchema = mongoose.Schema({
  version: {
    type: String,
    required: [true, 'La versión de la Caja es necesario establecerla.'],
  },
  providers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    }],
    default: [],
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: [true, 'Es necesario que las versiones tengan una caja asociada'],
  },
});

versionSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

versionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'providers',
    select: '-__v',
  });
  next();
});

versionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.box;
  return obj;
};

versionSchema.index({ version: 1, box: 1 }, { unique: true });

const Version = mongoose.model('Version', versionSchema);

module.exports = Version;
