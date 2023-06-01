const mongoose = require('mongoose');

const {
  databaseUrl,
} = require('./settings');

const startMongoDB = async () => {
  try {
    await mongoose.connect(databaseUrl);
  } catch (e) {
    console.error(e);
  }
};

module.exports = startMongoDB;
