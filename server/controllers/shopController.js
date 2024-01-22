const shopService = require('../services/shop-service');

class ShopController {
  async getShopData(req, res, next) {
    try {
      const shopData = await shopService.getShopData();
      return res.json(shopData);
    } catch(err) {
      next(err);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { itemID } = req.body;
      const userID = JSON.parse(req.cookies.refresh_token).user.id;

      await shopService.addToCart(itemID, userID);

      // if(!shopUpdate.acknowledged && !cartUpdate.acknowledged) {
      //   return res.status(500).json({ message: 'Something went wrong!' });
      // }
      return res.status(200).json({ message: 'Item successfully added to cart!' });
    } catch(err) {
      next(err);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const { itemID, amount } = req.body;
      const userID = JSON.parse(req.cookies.refresh_token).user.id;

      const result = await shopService.removeFromCart(itemID, amount, userID);

      return res.status(200).json({ message: 'Item successfully removed from cart!' });
    } catch(err) {
      next(err);
    }
  }

  async getCart(req, res, next) {
    try {
      const userID = JSON.parse(req.cookies.refresh_token).user.id;
      const result = await shopService.getCart(userID);

      res.json(result);
    } catch(err) {
      next(err);
    }
  }

  async makeOrder(req, res, next) {
    try {
      const { cart } = req.body;
      const userID = JSON.parse(req.cookies.refresh_token).user.id;

      const result = await shopService.makeOrder( cart, userID );
      console.log('Order result', result);
      return res.json({ message: 'Успешно!' })
    } catch(err) {
      next(err);
    }
  }
}

module.exports = new ShopController();