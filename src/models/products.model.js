const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: {
    type: Number,
    unique: true,
    required: true,
    index:true
  },
  stock: Number,
  category: String
})

// productsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model(productsCollection, productsSchema);