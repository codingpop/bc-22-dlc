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
    mongoose.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
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

    const resultSchema = new mongoose.Schema({
      user: String,
      score: String,
      course: String,
      date: { type: String, default: Date.now() }
    });
    this.result = mongoose.model('Results', resultSchema);

    const userSchema = new mongoose.Schema({
      first_name: String,
      last_name: String,
      email: String,
      username: String,
      password: String,
    });
    this.user = mongoose.model('users', userSchema);
  }


/**
 * @description saves questions into database
 * @param {string} theQuestion
 *  @param {string} optionA
 *  @param {string} optionB
 *  @param {string} optionC
 *  @param {string} optionD
 *  @param {string} rightAnswer
 *  @param {string} courseOfStudy
 * @return {String} nothing
 */
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


/**
 * @description: gets 10 questions for quiz
 * @param {string} studentCourse
 *  @return {Object} result
 */
  getQuestions(studentCourse) {
    const result = this.Question.find({ course: studentCourse }).limit(10).exec();
    return result;
  }

/**
 * @description: saves result of the assessment
 * @param {string} username
 * @param {string} stdScore
 * @param {string} theCourse
 *  @return {String} nothing
 */
  saveResult(username, stdScore, theCourse) {
    const resultToPut = new this.result({
      user: username,
      score: stdScore,
      course: theCourse
    });
    resultToPut.save((err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }

/**
 * @description: gets assessment results
 * @param {string} username
 *  @return {Object} result
 */
  getResult(username) {
    const result = this.result.find({ user: username }).sort({ _id: -1 }).exec();
    return result;
  }

  getUserByUsername(user_name) {
    const result = this.user.find({ username: user_name }).exec();
    return result;
  }
  getUserByEmail(eMail) {
    const result = this.user.find({ email: eMail }).exec();
    return result;
  }

  registerUsers(firstName, lastName, eMail, userName, passWord) {
    const userToInsert = new this.user({
      first_name: firstName,
      last_name: lastName,
      email: eMail,
      username: userName,
      password: passWord
    });
    userToInsert.save((err) => {
      if (err) {
        throw new Error(err);
      }
    });
  }
}


export default new AssessmentDatabase();
