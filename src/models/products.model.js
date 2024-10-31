const mongoose = require('mongoose');

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: {
    type: Number,
    unique: true,
    required: true
  },
  stock: Number,
  category: String
})

module.exports = mongoose.model(productsCollection, productsSchema);