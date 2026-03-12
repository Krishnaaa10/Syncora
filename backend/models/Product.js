const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Item_ID: { type: String, required: true, unique: true },
  Item_Name: { type: String, required: true },
  Store_ID: { type: String, required: true },
  Price: { type: Number, required: true },
  Stock_Available: { type: Number, required: true, default: 0 },
  Category: { type: String, default: 'Uncategorized' },
  Sub_Category: { type: String, default: '' },
  Unit_Size: { type: String, default: '1 unit' },
  Image_URL: { type: String, default: '' },
  Description: { type: String, default: '' }
});

module.exports = mongoose.model('Product', productSchema);
