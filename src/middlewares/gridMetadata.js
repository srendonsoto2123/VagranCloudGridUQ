const createMetadataGrid = (req, res, next) => {
  req.gridMetadata = {};
  next();
};

module.exports = {
  createMetadataGrid,
};
