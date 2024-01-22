const { Schema, model } = require('mongoose');

const itemModel = new Schema({
  itemID: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
  cartAmount: Number,
})

const cartSchema = new Schema({  
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  cart: [itemModel],
})

module.exports = new model('Cart', cartSchema, 'user_carts');