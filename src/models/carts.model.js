const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    Produto: String

})

module.exports = mongoose.model(cartsCollection, cartsSchema);