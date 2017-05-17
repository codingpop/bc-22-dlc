'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _database = require('../config/database');

var _database2 = _interopRequireDefault(_database);

var _course = require('../models/course');

var _course2 = _interopRequireDefault(_course);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var salt = _bcrypt2.default.genSaltSync(10); /* eslint linebreak-style: ["error", "windows"]*/

var router = _express2.default.Router();

// Nurudeen starts here
var sess = void 0;

router.get('/', function (req, res) {
  _course2.default.find(function (err, data) {
    if (err) throw err;
    res.render('index', { items: data });
  }).sort({ _id: -1 }).limit(6);
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

router.get('/login', function (req, res) {
  res.render('login.ejs', { error: '', inputedValues: '' });
});

router.get('/startquiz', function (req, res) {
  sess = req.session;
  if (sess.user) {
    res.render('startquiz.ejs');
  } else {
    res.redirect('/');
  }
});

router.post('/loadquiz', function (req, res) {
  sess = req.session;
  sess.course = req.body.course;
  var result = _database2.default.getQuestions(req.body.course);
  result.then(function (loadedQuestion) {
    res.send(loadedQuestion);
  });
});

router.post('/showresult', function (req, res) {
  sess = req.session;
  if (sess.user) {
    sess = req.session;
    var questions = (0, _keys2.default)(req.body);
    var scores = 0;
    for (var _question = 0; _question < questions.length; _question += 1) {
      if (Array.isArray(req.body[questions[_question]])) {
        if (req.body[questions[_question]][0] === req.body[questions[_question]][1]) {
          scores += 1;
        }
      }
    }
    // save the result to database;
    _database2.default.saveResult(sess.user, scores, sess.course);
    res.render('showresult.ejs', { score: scores, totalQuestionNo: 10 });
    // }
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
  sess = req.session;
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
          sess.user = req.body.username;
          _course2.default.find(function (err, data) {
            if (err) throw err;
            res.render('dashboard', { items: data, user: sess.user });
          });
        }
      } else {
        res.render('signup.ejs', { error: [{ msg: 'You have registered before, kindly go and login' }], inputedValues: req.body });
      }
    });
  });
});

router.post('/login', function (req, res) {
  sess = req.session;
  var userByUsername = _database2.default.getUserByUsername(req.body.username);
  userByUsername.then(function (result) {
    if (result.length !== 0) {
      if (_bcrypt2.default.compareSync(req.body.password, result[0].password)) {
        if (req.body.username === 'admin') {
          res.render('admindashboard.ejs');
        } else {
          sess.userID = result[0].id;
          sess.user = result[0].username;

          _course2.default.find(function (err, data) {
            if (err) throw err;
            res.render('dashboard', { items: data, user: sess.user });
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

router.get('/watch/:id', function (req, res) {
  var idValue = req.params.id;
  _course2.default.findOne({ _id: idValue }, function (err, data) {
    if (err) throw err;
    var chapters = data.chapters;
    var display = chapters[0].resource;
    res.render('watch', { item: data, video: display });
  });
});

router.get('/watch/video/:video', function (req, res) {
  var videoName = req.params.video;
  _course2.default.findOne({ 'chapters.name': videoName }, function (err, data) {
    if (err) throw err;
    var chapters = data.chapters;
    var display = chapters[0].resource;
    chapters.forEach(function (field) {
      if (videoName === field.name) {
        display = field.resource;
      }
    });
    res.render('watch', { item: data, video: display });
  });
});

router.get('/profile', function (req, res) {
  var results = _database2.default.getResult(sess.user);
  results.then(function (records) {
    res.render('profile', { user: sess.user, lastResult: records });
  });
});

router.get('/dashboard', function (req, res) {
  sess = req.session;
  if (sess.user) {
    _course2.default.find(function (err, data) {
      if (err) throw err;
      res.render('dashboard', { items: data, user: sess.user });
    });
  } else {
    res.redirect('/');
  }
});

var Schema = _mongoose2.default.Schema;
var question = new Schema({
  question: {
    type: String, required: true
  },
  idOfPoster: {
    type: String, required: true
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
    type: String, required: true
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
  sess = req.session;
  if (sess.user) {
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
  } else {
    res.redirect('/');
  }
});

router.post('/addQuestion', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var questionToAdd = req.body.question;
    var notifyToAdd = req.body.notify;
    var tagToAdd = req.body.tag;
    var newQuestion = new Question({
      question: questionToAdd,
      idOfPoster: sess.userID,
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
  } else {
    res.redirect('/');
  }
});

router.get('/question/:id', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var id = req.params.id;
    if (id.length >= 20) {
      Question.findById(id, function (err, uniqueQuestion) {
        if (err) {
          throw err;
        }
        Answer.find({ questionid: id }).sort({ date: -1 }).exec(function (err, uniqueAnswers) {
          res.render('pages/question.ejs', { question: uniqueQuestion, uniqueAnswer: uniqueAnswers, user: sess });
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
  } else {
    res.redirect('/');
  }
});

router.post('/addAnswer', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var answer = req.body.answer;
    var questionId = req.body.questionid;
    var userId = sess.userID;
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
  } else {
    res.redirect('/');
  }
});

router.post('/search', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var searchTerm = req.body.term;
    Question.find({ question: new RegExp(searchTerm, 'i') }).limit(5).exec(function (err, doc) {
      if (err) {
        throw err;
      }
      res.send(doc);
    });
  } else {
    res.redirect('/');
  }
});

router.post('/addvote', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var userId = sess.userID;
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
  } else {
    res.redirect('/');
  }
});

router.post('/delete', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var type = req.body.type;
    var key = req.body.key;
    if (type === 'question') {
      Question.findByIdAndRemove(key).exec(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send('Deleted');
        }
      });
    } else {
      Answer.findByIdAndRemove(key).exec(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.send('Deleted');
        }
      });
    }
  } else {
    res.redirect('/');
  }
});

router.post('/saveEdits', function (req, res) {
  sess = req.session;
  if (sess.user) {
    var type = req.body.type;
    var val = req.body.val;
    var id = req.body.key;
    if (type === 'question') {
      Question.findById(id, function (err, questionToSave) {
        questionToSave.question = val;
        questionToSave.save();
      });
    } else {
      Answer.findById(id, function (err, answerToSave) {
        answerToSave.question = val;
        answerToSave.save();
      });
    }
    res.send('Saved');
  } else {
    res.redirect('/');
  }
});
exports.default = router;