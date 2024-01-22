const { Schema, model } = require('mongoose');

const libraryModel = new Schema({
  books: Array,
  videos: Array,
  articles: Array,
  practicals: Array,
})

module.exports = new model('Library', libraryModel, 'library');