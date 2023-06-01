const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const deleteAllUsers = catchAsync(async (req, res) => {
  const usersDeleted = await User.deleteMany();

  res.status(204).json({
    status: 'success',
    dataDeleted: {
      usersDeleted,
    },
  });
});

module.exports = {
  getAllUsers,
  deleteAllUsers,
};
