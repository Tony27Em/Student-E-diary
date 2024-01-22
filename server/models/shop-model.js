const { Schema, model } = require('mongoose');

const shopSchema = new Schema({
  name: String,
  image: String,
  description: String,
  amount: Number,
  price: Object,
})

module.exports = new model('Shop', shopSchema, 'shop');