const { Schema, model } = require('mongoose');

const rewardModel = new Schema({  
  image: String,
  name: String,
  crystal: Number,
  coin: Number,
  description: String,
})

module.exports = new model('Reward', rewardModel, 'rewards');