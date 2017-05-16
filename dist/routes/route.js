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
  var result = _assessmentDatabase2.default.getCourses();
  result.then(function (course) {
    res.render('startquiz.ejs', { courses: course });
  });
});

router.post('/loadquiz', function (req, res) {
  var course = req.body.course;
  var result = _assessmentDatabase2.default.getQuestions(course);
  result.then(function (questions) {
    res.send(questions);
  });
});

exports.default = router;