const { Schema, model } = require('mongoose');

const faqSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
})

module.exports = new model('Faq', faqSchema, 'faq');