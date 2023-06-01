const fs = require('fs').promises;
const path = require('path');
const catchAsync = require('../utils/catchAsync');

const PATH = path.join(__dirname, '..', '..', 'public');

const getPathBox = catchAsync(async (req, res, next) => {
  const { name, version, provider } = req.params;

  const pathBox = `${name}/versions/${version}/providers/${provider}.box`;

  req.gridMetadata.pathBox = pathBox;

  next();
});

const uploadFile = catchAsync(async (req, res) => {
  const { name, version, provider } = req.params;
  const { version: v } = req.gridMetadata;

  const prov = v.providers.find((p) => p.name === provider);

  const { box } = req.files;

  const pathBox = `${name}/versions/${version}/providers/${provider}.box`;
  prov.url = `${req.protocol}://${req.get('host')}/${pathBox}`;

  await prov.save();

  box.mv(`${PATH}/${pathBox}`, (err) => {
    if (err) {
      throw err;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Archivo subido',
    });
  });
});

const deleteFile = catchAsync(async (req, res) => {
  const { name, version, provider } = req.params;

  const pathBox = `${name}/versions/${version}/providers/${provider}.box`;

  await fs.rm(`${PATH}/${pathBox}`, {
    recursive: true,
  });

  return res.status(204).json({
    status: 'success',
    message: 'Provedor eliminado',
  });
});

module.exports = {
  getPathBox,
  uploadFile,
  deleteFile,
};
