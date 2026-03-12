const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  Store_ID: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Brand: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

module.exports = mongoose.model('Store', storeSchema);
