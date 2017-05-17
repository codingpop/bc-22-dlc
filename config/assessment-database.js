import mongoose from 'mongoose';

/**
 * database class
 * @class
 */
class AssessmentDatabase {
/**
 *
 * @constructor
 */
  constructor() {
    mongoose.connect('mongodb://noordean:ibrahim5327@ds161190.mlab.com:61190/nurudb');
    const db = mongoose.connection;
    db.on('connected', () => {
      console.log('database connected');
    });

    const questionSchema = new mongoose.Schema({
      question: String,
      option1: String,
      option2: String,
      option3: String,
      option4: String,
      correctAnswer: String,
      course: String,
    });
    this.Question = mongoose.model('Questions', questionSchema);
  }

  saveQuestion(theQuestion, optionA, optionB, optionC, optionD, rightAnswer, courseOfStudy) {
    const questionToPut = new this.Question({
      question: theQuestion,
      option1: optionA,
      option2: optionB,
      option3: optionC,
      option4: optionD,
      correctAnswer: rightAnswer,
      course: courseOfStudy
    });
    questionToPut.save((err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }

 /* getCourses() {
    const result = this.Question.distinct('course').exec();
    return result;
  }*/

  getQuestions(studentCourse) {
    const result = this.Question.find({ course: studentCourse }).exec();
    return result;
  }
}

export default new AssessmentDatabase();
