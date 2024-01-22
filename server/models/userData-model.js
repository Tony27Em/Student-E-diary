const { Schema, model } = require('mongoose');

const userDataSchema = new Schema({  
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  data: Object,
})

module.exports = new model('userData', userDataSchema, 'users_data')