const { Schema, model } = require('mongoose');

const itemModel = new Schema({
  itemID: {
    type: Schema.Types.ObjectId,
    ref: 'Shop',
  },
  cartAmount: Number,
})

const orderModel = new Schema({  
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderList: [itemModel],
  status: {
    type: String,
    default: 'Заказ принят',
  },
})

module.exports = new model('Order', orderModel, 'orders')