const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: {
        type: [Number],
        required: true
    }
});

module.exports = mongoose.model(cartsCollection, cartsSchema);