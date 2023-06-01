const mongoose = require('mongoose');

const providerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Es necesario especificar un proveedor'],
    enum: {
      values: ['virtualbox', 'vmware_fusion', 'hyperv', 'docker', 'vmware'],
      message: 'El valor debería ser algunos de los proveedors como estos:\nvirtualbox, vmware_fusion y hyperv',
    },
    default: 'virtualbox',
  },
  url: {
    type: String,
    default: '',
  },
});

providerSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
