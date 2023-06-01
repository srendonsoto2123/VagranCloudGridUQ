const Box = require('../models/box.model');
const Version = require('../models/version.model');

const catchAsync = require('../utils/catchAsync');

const createBox = catchAsync(async (req, res) => {
  const { name, description, shortDescription } = req.body;

  const newBox = await Box.create({
    name,
    description,
    shortDescription,
  });

  res.status(201).json({
    status: 'success',
    data: {
      box: newBox,
    },
  });
});

const deleteBox = catchAsync(async (req, res) => {
  const { name } = req.params;

  const box = await Box.deleteOne({ name });

  await Version.deleteMany({ box: box._id });

  res.status(204).json({
    status: 'success',
    delete: {
      box,
    },
  });
});

const getBox = catchAsync(async (req, res, next) => {
  const { name } = req.params;

  const box = await Box.findOne({ name }).populate({
    path: 'versions',
  });
  req.gridMetadata.box = box;

  next();
});

const getOneBox = catchAsync(async (req, res) => {
  const { box } = req.gridMetadata;

  res.status(200).json(box);
});

const getAllBoxes = catchAsync(async (req, res) => {
  const boxes = await Box.find().populate({
    path: 'versions',
  });

  res.status(200).json({
    status: 'success',
    data: {
      boxes,
    },
  });
});

module.exports = {
  createBox,
  deleteBox,
  getAllBoxes,
  getBox,
  getOneBox,
};
