const ShopModel = require('../models/shop-model');
const OrderModel = require('../models/order-model');
const CartModel = require('../models/cart-model');

class ShopService {
  async getShopData() {
    const shopData = await ShopModel.find();
    return shopData;
  }

  async addToCart(itemID, userID) {
    const shopUpdate = await ShopModel.updateOne(
      { _id: itemID },
      { $inc: { amount: -1 } }
    );

    const myCart = await CartModel.findOne({ userID });

    if(!myCart) {
      const cartUpdate = await CartModel.create({ userID, cart: [ { itemID, cartAmount: 1 } ] });
      return cartUpdate;
    }

    const modifiedCart = await CartModel.findOneAndUpdate(
      { userID, 'cart': { $elemMatch: { 'itemID': itemID } } },
      { $inc: { 'cart.$.cartAmount': 1 } },
      { new: true },
    );

    if(!modifiedCart) {
      await CartModel.updateOne(
        { userID },
        { $push: { 'cart': { itemID, cartAmount: 1 }} }
      )
    }

    return;
  }
  
  async removeFromCart(itemID, amount, userID) {
    const shopUpdate = await ShopModel.updateOne(
      { _id: itemID },
      { $inc: { amount: amount } }
    );

    const modifiedCart = await CartModel.findOneAndUpdate(
      { 'cart': { $elemMatch: { 'itemID': itemID } } },
      { $inc: { 'cart.$.cartAmount': -amount } }, 
      { new: true }
    );

    if(!!modifiedCart.cart.find(item => item.cartAmount === 0)) {
      await CartModel.updateOne(
        { userID },
        { $pull: { 'cart': { itemID } } }
      )
    }
    
    return;
  }

  async getCart(userID) {
    const myCart = await CartModel.findOne({ userID });
    return myCart;
  }

  async makeOrder(cart, userID) {
    const result = await OrderModel.create({ userID, orderList: cart });
    return result;
  }
}

module.exports = new ShopService();