const Version = require('../models/version.model');

const catchAsync = require('../utils/catchAsync');

const createVersion = catchAsync(async (req, res) => {
  const { version } = req.body;
  const { box } = req.gridMetadata;

  const newVersion = await Version.create({
    version,
    box: box._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      version: newVersion,
    },
  });
});

const getVersion = catchAsync(async (req, res, next) => {
  const { box } = req.gridMetadata;
  const { version } = req.params;

  const versionDoc = await Version.findOne({ version, box: box._id });

  req.gridMetadata.version = versionDoc;

  next();
});

const getOneVersion = catchAsync(async (req, res) => {
  const { version } = req.gridMetadata;

  res.status(200).json({
    version,
  });
});

const getAllVersions = catchAsync(async (req, res) => {
  const { box } = req.gridMetadata;

  const versions = await Version.find({ box: box._id });

  res.status(200).json({
    status: 'success',
    data: {
      versions,
    },
  });
});

const deleteVersion = catchAsync(async (req, res) => {
  const { box } = req.gridMetadata;
  const { version } = req.params;

  const versionDeleted = await Version.deleteOne({ version, box: box._id });

  res.status(204).json({
    status: 'success',
    deleted: {
      version: versionDeleted,
    },
  });
});

module.exports = {
  createVersion,
  getVersion,
  getOneVersion,
  getAllVersions,
  deleteVersion,
};
