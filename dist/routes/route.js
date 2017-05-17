'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _assessmentDatabase = require('../config/assessment-database');

var _assessmentDatabase2 = _interopRequireDefault(_assessmentDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  // get username from session to replace noordean
  res.render('studentsdashboard.ejs', { user: 'noordean', lastResult: '' });
});
router.get('/addquestion', function (req, res) {
  res.render('addquestion.ejs');
});

router.post('/addquestion', function (req, res) {
  var question = req.body.question;
  var option1 = req.body.option1;
  var option2 = req.body.option2;
  var option3 = req.body.option3;
  var option4 = req.body.option4;
  var rightAnswer = req.body.rightanswer;
  var course = req.body.course;
  res.send(_assessmentDatabase2.default.saveQuestion(question, option1, option2, option3, option4, rightAnswer, course));
});

router.get('/startquiz', function (req, res) {
  res.render('startquiz.ejs');
});

router.get('/loadquiz', function (req, res) {
  // 'Javascript will be replaced with course session when marging
  var result = _assessmentDatabase2.default.getQuestions('Javascript');
  result.then(function (loadedQuestion) {
    res.render('doquiz.ejs', { questions: loadedQuestion });
  });
});

router.post('/showresult', function (req, res) {
  // add user name from session when marging
  // add course name(title) too
  var questions = Object.keys(req.body);
  var scores = 0;
  for (var question = 0; question < questions.length; question += 1) {
    if (Array.isArray(req.body[questions[question]])) {
      if (req.body[questions[question]][0] === req.body[questions[question]][1]) {
        scores += 1;
      }
    }
  }
  res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
});

exports.default = router;