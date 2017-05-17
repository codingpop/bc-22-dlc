import mongoose from 'mongoose';

mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');

const courseSchema = mongoose.Schema({
  course_id: mongoose.Schema.Types.ObjectId,
  course_title: String,
  description: String,
  chapters: Array,
  author: String
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
