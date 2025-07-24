const mongoose = require('mongoose');

const orderItemScheme = mongoose.Schema({
  quantity: {
    type: Number,
    require: true,
  },
  product: {
    type: mongoose.Schema.Types.objectId,
    ref: 'Product',
    require: true,
  },
});

exports.OrderItem = mongoose.model('OrderItem', orderItemScheme);
