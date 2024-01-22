const { Schema, model } = require('mongoose');

const groupModel = new Schema({
  group: String,
  main_teacher: String,
  substitute_teacher: String,
  students_list: Array,
  lessons_list: Array,
})

module.exports = new model('Group', groupModel);