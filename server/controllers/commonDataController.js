const dataService = require('../services/commonData-service');

class CommonDataController {
  async getRewardsList(req, res, next) {
    try {
      const rewardsData = await dataService.getRewardsList();
      return res.json(rewardsData); 
    } catch(err) {
      next(err);
    }
  }

  async getFaqData(req, res, next) {
    try {
      const faqData = await dataService.getFaqData();
      return res.json(faqData);
    } catch(err) {
      next(err);
    }
  }

  async getNewsData(req, res, next) {
    try {
      const newsData = await dataService.getNewsData();
      return res.status(200).json(newsData);
    } catch(err) {
      next(err);
    }
  }
}

module.exports = new CommonDataController();