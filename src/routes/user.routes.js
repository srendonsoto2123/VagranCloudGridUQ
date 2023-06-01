const router = require('express').Router();

const { getAllUsers, deleteAllUsers } = require('../controllers/user.controller');

router.route('/')
  .get(getAllUsers)
  .delete(deleteAllUsers);

module.exports = router;
