'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _database = require('../config/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Nurudeen starts here

router.get('/', function (req, res) {
  var username = 'noordean';
  var results = _database2.default.getResult(username);
  results.then(function (result) {
    // get username from session to replace noordean
    res.render('studentsdashboard.ejs', { user: username, lastResult: result[0].score });
  });
});

router.get('/savequestion', function (req, res) {
  res.render('addquestion.ejs');
});

router.post('/savequestion', function (req, res) {
  var question = req.body.question;
  var option1 = req.body.option1;
  var option2 = req.body.option2;
  var option3 = req.body.option3;
  var option4 = req.body.option4;
  var rightAnswer = req.body.rightanswer;
  var course = req.body.course;
  res.send(_database2.default.saveQuestion(question, option1, option2, option3, option4, rightAnswer, course));
});

router.get('/startquiz', function (req, res) {
  res.render('startquiz.ejs');
});

router.get('/loadquiz', function (req, res) {
  // 'Javascript will be replaced with the student's course'
  var result = _database2.default.getQuestions("Let's Learn ES6");
  result.then(function (loadedQuestion) {
    res.render('doquiz.ejs', { questions: loadedQuestion });
  });
});

router.post('/showresult', function (req, res) {
  // add user name and course from session when merging
  var user = 'noordean';
  var course = "Let's Learn ES6";
  var questions = Object.keys(req.body);
  var scores = 0;
  for (var _question = 0; _question < questions.length; _question += 1) {
    if (Array.isArray(req.body[questions[_question]])) {
      if (req.body[questions[_question]][0] === req.body[questions[_question]][1]) {
        scores += 1;
      }
    }
  }

  // save the result to database;
  _database2.default.saveResult(user, scores, course);
  res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
});

router.get('/showallresult', function (req, res) {
  var username = 'noordean';
  var results = _database2.default.getResult(username);
  results.then(function (resultt) {
    res.render('showallresult.ejs', { result: resultt });
  });
});

// Nurudeen stops here
router.get('/signup', function (req, res) {
  res.render('signup.ejs');
});

router.post('/signup', function (req, res) {
  var userByUsername = _database2.default.getUserByUsername(req.body.username);
  var userByEmail = _database2.default.getUserByEmail(req.body.email);
  userByUsername.then(function (resultByUsername) {
    userByEmail.then(function (resultByEmail) {
      if (resultByUsername.length === 0 && resultByEmail.length === 0) {
        res.send('registration successful');
      }
    });
  });
});

// Emmannuel starts here
var Schema = _mongoose2.default.Schema;
var question = new Schema({
  question: {
    type: String, required: true
  },
  idOfPoster: {
    type: Number, required: true
  },
  date: {
    type: Date, required: true
  },
  tag: {
    type: String, required: true
  },
  votes: {
    numberofvotes: {
      type: Number, required: false
    },
    voters: {
      type: Array, required: false
    }
  },
  notify: {
    type: String, required: true
  },
  answer: {
    poster: { type: Array, required: false }
  },
  views: {
    viewers: { type: Array, required: false }
  }
}, { collection: 'Forum' });
var answers = new Schema({
  questionid: {
    type: String, required: true
  },
  idOfPoster: {
    type: Number, required: true
  },
  value: {
    type: String, required: true
  },
  date: {
    type: Date, required: true
  },
  voters: {
    type: Array, required: false
  }
}, { collection: 'Answers' });

var Question = _mongoose2.default.model('Question', question);
var Answer = _mongoose2.default.model('Answer', answers);

router.get('/forum', function (req, res) {
  Question.find({}).sort({ date: -1 }).limit(10).exec(function (err, allQuestions) {
    Question.find({}).exec(function (err, totalQuestion) {
      if (err) {
        throw err;
      } else {
        var totalRecords = totalQuestion.length;
        res.render('pages/forum.ejs', { questions: allQuestions, totalRecord: totalRecords });
      }
    });
  });
});

router.post('/addQuestion', function (req, res) {
  var questionToAdd = req.body.question;
  var notifyToAdd = req.body.notify;
  var tagToAdd = req.body.tag;
  // to add id of logined in user as idOfPoster
  var newQuestion = new Question({
    question: questionToAdd,
    idOfPoster: 1,
    date: Date.now(),
    tag: tagToAdd,
    notify: notifyToAdd
  });
  newQuestion.save(function (err) {
    if (err) {
      res.send(err);
    }
    res.send('Saved');
  });
});

router.get('/question/:id', function (req, res) {
  var id = req.params.id;
  if (id.length >= 20) {
    Question.findById(id, function (err, uniqueQuestion) {
      if (err) {
        throw err;
      }
      Answer.find({ questionid: id }, function (err, uniqueAnswers) {
        res.render('pages/question.ejs', { question: uniqueQuestion, uniqueAnswer: uniqueAnswers });
      });
    });
  } else {
    Question.find({ tag: id }, function (err, singleQuestion) {
      var totalRecords = singleQuestion.length;
      if (err) {
        throw err;
      }
      if (singleQuestion.length === 0) {
        res.render('pages/forum404.ejs');
      } else {
        res.render('pages/forum.ejs', { questions: singleQuestion, totalRecord: totalRecords });
      }
    });
  }
});

router.post('/addAnswer', function (req, res) {
  var answer = req.body.answer;
  var questionId = req.body.questionid;
  var userId = 1; // to change to a real userId
  var newAnswer = new Answer({
    questionid: questionId,
    idOfPoster: userId,
    value: answer,
    date: Date.now()
  });
  newAnswer.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Added');
    }
  });
});

router.post('/search', function (req, res) {
  var searchTerm = req.body.term;
  Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec(function (err, doc) {
    if (err) {
      throw err;
    }
    res.send(doc);
  });
});

router.post('/addvote', function (req, res) {
  // to change to real user
  var userId = 1;
  var answerId = req.body.answerid;
  Answer.findById(answerId, function (err, answer) {
    var voters = answer.voters;
    if (voters.indexOf(userId) < 0) {
      voters.push(userId);
      answer.voters = voters;
      answer.save();
      res.send('Done');
    } else {
      res.send('You have voted already');
    }
  });
});

exports.default = router;