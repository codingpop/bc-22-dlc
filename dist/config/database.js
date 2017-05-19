'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * database class
 * @class
 */
var AssessmentDatabase = function () {
  /**
   *
   * @constructor
   */
  function AssessmentDatabase() {
    (0, _classCallCheck3.default)(this, AssessmentDatabase);

    _mongoose2.default.connect('mongodb://jchinonso:poly12345@ds143221.mlab.com:43221/fastlearn');
    var db = _mongoose2.default.connection;
    db.on('connected', function () {
      console.log('database connected');
    });

    var questionSchema = new _mongoose2.default.Schema({
      question: String,
      option1: String,
      option2: String,
      option3: String,
      option4: String,
      correctAnswer: String,
      course: String
    });
    this.Question = _mongoose2.default.model('Questions', questionSchema);

    var resultSchema = new _mongoose2.default.Schema({
      user: String,
      score: String,
      course: String,
      date: { type: String, default: Date.now() }
    });
    this.result = _mongoose2.default.model('Results', resultSchema);

    var userSchema = new _mongoose2.default.Schema({
      first_name: String,
      last_name: String,
      email: String,
      username: String,
      password: String,
      courses: [{
        course_id: { type: [_mongoose2.default.Schema.Types.ObjectId] }
      }]
    });
    this.user = _mongoose2.default.model('users', userSchema);
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


  (0, _createClass3.default)(AssessmentDatabase, [{
    key: 'saveQuestion',
    value: function saveQuestion(theQuestion, optionA, optionB, optionC, optionD, rightAnswer, courseOfStudy) {
      var questionToPut = new this.Question({
        question: theQuestion,
        option1: optionA,
        option2: optionB,
        option3: optionC,
        option4: optionD,
        correctAnswer: rightAnswer,
        course: courseOfStudy
      });
      questionToPut.save(function (err) {
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

  }, {
    key: 'getQuestions',
    value: function getQuestions(studentCourse) {
      var result = this.Question.find({ course: studentCourse }).limit(10).exec();
      return result;
    }

    /**
     * @description: saves result of the assessment
     * @param {string} username
     * @param {string} stdScore
     * @param {string} theCourse
     *  @return {String} nothing
     */

  }, {
    key: 'saveResult',
    value: function saveResult(username, stdScore, theCourse) {
      var resultToPut = new this.result({
        user: username,
        score: stdScore,
        course: theCourse
      });
      resultToPut.save(function (err) {
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

  }, {
    key: 'getResult',
    value: function getResult(username) {
      var result = this.result.find({ user: username }).sort({ _id: -1 }).exec();
      return result;
    }
  }, {
    key: 'getUserByUsername',
    value: function getUserByUsername(userName) {
      var result = this.user.find({ username: userName }).exec();
      return result;
    }
  }, {
    key: 'getUserByEmail',
    value: function getUserByEmail(eMail) {
      var result = this.user.find({ email: eMail }).exec();
      return result;
    }
  }, {
    key: 'registerUsers',
    value: function registerUsers(firstName, lastName, eMail, userName, passWord) {
      var userToInsert = new this.user({
        first_name: firstName,
        last_name: lastName,
        email: eMail,
        username: userName,
        password: passWord
      });
      userToInsert.save(function (err) {
        if (err) {
          throw new Error(err);
        }
      });
    }
  }]);
  return AssessmentDatabase;
}();

exports.default = new AssessmentDatabase();