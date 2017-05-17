const mongoose = require('mongoose');

mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');

const courseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  desc: String,
  chapters: Array,
  author: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
