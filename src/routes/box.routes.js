const router = require('express').Router();

const {
  protect, restrictTo,
} = require('../middlewares/auth');
const {
  createBox,
  deleteBox,
  getAllBoxes,
  getBox,
  getOneBox,
} = require('../controllers/box.controller');

const versionRouter = require('./version.routes');

router.route('/')
  .get(getAllBoxes)
  .post(protect, restrictTo('admin', 'seminario'), createBox);

router.route('/:name')
  .get(getBox, getOneBox)
  .delete(protect, restrictTo('admin', 'seminario'), deleteBox);

router.use('/:name/versions/', protect, restrictTo('admin', 'seminario'), getBox, versionRouter);

module.exports = router;
