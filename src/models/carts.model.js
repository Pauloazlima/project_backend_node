const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({

})

module.exports = mongoose.model(cartsCollection, cartsSchema);