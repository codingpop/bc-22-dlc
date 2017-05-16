'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, AssessmentDatabase);

    _mongoose2.default.connect('mongodb://noordean:ibrahim5327@ds161190.mlab.com:61190/nurudb');
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
  }

  _createClass(AssessmentDatabase, [{
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
  }, {
    key: 'getCourses',
    value: function getCourses() {
      var result = this.Question.distinct('course').exec();
      return result;
    }
  }, {
    key: 'getQuestions',
    value: function getQuestions(studentCourse) {
      var result = this.Question.find({ course: studentCourse }).exec();
      return result;
    }
  }]);

  return AssessmentDatabase;
}();

exports.default = new AssessmentDatabase();