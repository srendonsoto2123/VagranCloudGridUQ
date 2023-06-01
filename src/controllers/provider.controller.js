const Provider = require('../models/provider.model');

const catchAsync = require('../utils/catchAsync');

const createProvider = catchAsync(async (req, res) => {
  const { provider } = req.body;
  const { version } = req.gridMetadata;

  const newProvider = await Provider.create({
    name: provider,
  });

  version.providers.push(newProvider._id);
  await version.save();

  res.status(201).json({
    status: 'success',
    data: {
      provider: newProvider,
    },
  });
});

const deleteProvider = catchAsync(async (req, res, next) => {
  const { version } = req.gridMetadata;
  const { provider } = req.params;

  const indexProvider = version.providers.findIndex((p) => p.name === provider);
  await Provider.findByIdAndDelete(version.providers[indexProvider]._id);

  version.providers.slice(indexProvider, 1);

  await version.save();

  next();
});

module.exports = {
  createProvider,
  deleteProvider,
};
