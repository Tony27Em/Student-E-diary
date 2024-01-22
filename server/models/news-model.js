const { Schema, model } = require('mongoose');

const newsSchema = new Schema({
  title: String,
  text: String,
  published: String,
})

module.exports = new model('News', newsSchema, 'news');