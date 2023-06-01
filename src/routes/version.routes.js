const router = require('express').Router({ mergeParams: true });

const routerProvider = require('./provider.routes');

const {
  getVersion,
  createVersion,
  getAllVersions,
  getOneVersion,
  deleteVersion,
} = require('../controllers/version.controller');

router.route('/')
  .get(getAllVersions)
  .post(createVersion);

router.route('/:version')
  .get(getVersion, getOneVersion)
  .delete(deleteVersion);

router.use('/:version/providers', getVersion, routerProvider);

module.exports = router;
