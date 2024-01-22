const rewardModel = require('../models/reward-model');
const faqModel = require('../models/faq-model');
const newsModel = require('../models/news-model');

class CommonDataService {
  async getRewardsList() {
    const rewardsData = await rewardModel.find();
    return rewardsData;
  }

  async getFaqData() {
    const faqData = await faqModel.find();
    return faqData;
  }

  async getNewsData() {
    const newsData = await newsModel.find();
    return newsData;
  }
}

module.exports = new CommonDataService();