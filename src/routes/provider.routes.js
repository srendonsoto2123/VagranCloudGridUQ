const router = require('express').Router({ mergeParams: true });

const {
  createProvider,
  deleteProvider,
} = require('../controllers/provider.controller');

const { uploadFile, deleteFile } = require('../middlewares/files');

router.route('/')
  .post(createProvider);

router.route('/:provider')
  .delete(deleteProvider, deleteFile)
  .post(uploadFile);

module.exports = router;
