'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('../config/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var salt = _bcrypt2.default.genSaltSync(10);
var router = _express2.default.Router();

// Nurudeen starts here
var sess = void 0;
router.get('/', function (req, res) {
  sess = req.session;
  if (sess.user) {
    req.session.destroy(function (err) {
      if (err) {
        throw new Error(err);
      }
    });
  }
  res.render('login.ejs', { error: '', inputedValues: '' });
});
router.get('/logout', function (req, res) {
  sess = req.session;
  req.session.destroy(function (err) {
    if (err) {
      throw new Error(err);
    } else {
      res.redirect('/');
    }
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
  sess = req.session;
  if (sess.user) {
    res.render('startquiz.ejs');
  } else {
    res.redirect('/');
  }
});

router.get('/loadquiz', function (req, res) {
  sess = req.session;
  if (sess.user) {
    // 'Javascript will be replaced with the student's course'
    var result = _database2.default.getQuestions("Let's Learn ES6");
    result.then(function (loadedQuestion) {
      res.render('doquiz.ejs', { questions: loadedQuestion });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/showresult', function (req, res) {
  sess = req.session;
  if (sess.user) {
    // add user name and course from session when merging
    sess = req.session;
    var course = "Let's Learn ES6";
    var questions = Object.keys(req.body);
    var getUnasweredQuestion = [];
    for (var _question = 0; _question < questions.length; _question += 1) {
      if (!Array.isArray(req.body[questions[_question]])) {
        getUnasweredQuestion.push('seen');
      }
    }
    if (getUnasweredQuestion.length > 0) {
      res.send('You have to answer all questions before submitting');
    } else {
      var scores = 0;
      for (var _question2 = 0; _question2 < questions.length; _question2 += 1) {
        if (Array.isArray(req.body[questions[_question2]])) {
          if (req.body[questions[_question2]][0] === req.body[questions[_question2]][1]) {
            scores += 1;
          }
        }
      }
      // save the result to database;
      _database2.default.saveResult(sess.user, scores, course);
      res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
    }
  } else {
    res.redirect('/');
  }
});

router.get('/showresult', function (req, res) {
  sess = req.session;
  if (sess.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/');
  }
});

router.get('/showallresult', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var results = _database2.default.getResult(sess.user);
    results.then(function (resultt) {
      res.render('showallresult.ejs', { result: resultt });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/signup', function (req, res) {
  res.render('signup.ejs', { error: '', inputedValues: '' });
});

router.post('/signup', function (req, res) {
  var userByUsername = _database2.default.getUserByUsername(req.body.username);
  var userByEmail = _database2.default.getUserByEmail(req.body.email);
  userByUsername.then(function (resultByUsername) {
    userByEmail.then(function (resultByEmail) {
      if (resultByUsername.length === 0 && resultByEmail.length === 0) {
        // trim and escape user's inputs
        req.sanitizeBody('first_name').trim();
        req.sanitizeBody('first_name').escape();
        req.sanitizeBody('last_name').trim();
        req.sanitizeBody('last_name').escape();
        req.sanitizeBody('username').trim();
        req.sanitizeBody('username').escape();
        req.sanitizeBody('email').trim();
        req.sanitizeBody('email').escape();
        req.sanitizeBody('password').trim();
        req.sanitizeBody('password').escape();
        req.sanitizeBody('password2').trim();
        req.sanitizeBody('password2').escape();

        // validate user inputs
        req.checkBody('last_name', 'Lastname should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('first_name', 'Firstname should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('username', 'Username should contain only alphanumeric characters').notEmpty().isAlphanumeric();
        req.checkBody('email', 'A valid email address is required').notEmpty().isEmail();
        req.checkBody('password', 'Password should contain only alphanumeric characters').notEmpty().isAlphanumeric();

        // collect validation errors
        var errors = [];
        if (req.validationErrors()) {
          errors = req.validationErrors();
        }
        if (req.body.password !== req.body.password2) {
          errors.push({ param: 'password', msg: 'The two passwords did not match' });
        }
        if (req.body.username.length < 5 || req.body.password.length < 5) {
          errors.push({ param: 'username/password', msg: 'Username and Password must contain atleast 5 characters' });
        }
        if (errors.length > 0) {
          res.render('signup.ejs', { error: errors, inputedValues: req.body });
        } else {
          var hashedPassword = _bcrypt2.default.hashSync(req.body.password, salt);
          _database2.default.registerUsers(req.body.first_name, req.body.last_name, req.body.email, req.body.username, hashedPassword);
          res.send('Registration successful, click <a href="/">here</a> to go to login page');
        }
      } else {
        res.render('signup.ejs', { error: [{ msg: 'You have registered before, kindly go and login' }], inputedValues: req.body });
      }
    });
  });
});

router.post('/dashboard', function (req, res) {
  sess = req.session;
  var userByUsername = _database2.default.getUserByUsername(req.body.username);
  userByUsername.then(function (result) {
    if (result.length !== 0) {
      if (_bcrypt2.default.compareSync(req.body.password, result[0].password)) {
        if (req.body.username === 'admin') {
          res.render('admindashboard.ejs');
        } else {
          sess.user = result[0].username;
          var results = _database2.default.getResult(sess.user);
          results.then(function (records) {
            res.render('studentsdashboard.ejs', { user: sess.user, lastResult: records });
          });
        }
      } else {
        res.render('login.ejs', { error: 'Incorrect password', inputedValues: req.body });
      }
    } else {
      res.render('login.ejs', { error: 'User does not exist', inputedValues: req.body });
    }
  });
});

router.get('/dashboard', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var results = _database2.default.getResult(sess.user);
    results.then(function (records) {
      res.render('studentsdashboard.ejs', { user: sess.user, lastResult: records });
    });
  } else {
    res.redirect('/');
  }
});
// Nurudeen stops here
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
    poster: { type: Number, required: false }
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
    notify: notifyToAdd,
    answer: 0
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
      Question.findByIdAndUpdate(questionId, { $inc: { answer: 1 } }, function (err) {
        if (err) {
          throw err;
        }
      });
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